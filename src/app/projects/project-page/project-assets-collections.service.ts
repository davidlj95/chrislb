import { Inject, Injectable, InjectionToken } from '@angular/core'
import { Project } from '../project'
import { VideoAssetsCollection } from './video-assets-collection'
import { YoutubePlaylist } from './youtube-playlist'
import { from, map, Observable } from 'rxjs'
import { AnyAssetsCollection } from './any-asset-collection'
import { AssetsCollection } from './assets-collection'
import assetsCollectionsJson from '../../../data/assets-collections.json'
import assetsCollectionsOrderJson from '../../../data/misc/assets-collections-order.json'
import lookbookCollection from '../../../data/assets-collections/lookbooks.json'
import videoCollectionJson from '../../../data/assets-collections/videos.json'
import { ImageAssetsCollection } from './image-assets-collection'
import { JsonFetcher } from '../../common/json-fetcher/json-fetcher'
import { PROJECTS_DIR } from '../../common/directories'
import { ImageAsset } from '../../common/images/image-asset'
import { ProjectImageAsset } from './project-image-asset'
import { LookbookNameAndSlug } from '../lookbook-name-and-slug'

@Injectable({
  providedIn: 'root',
})
export class ProjectAssetsCollectionsService {
  private assetsCollections: ReadonlyArray<AssetsCollection>
  private orderByCollectionSlug: Map<string, number>

  constructor(
    @Inject(ASSETS_COLLECTIONS)
    unsortedAssetsCollections: ReadonlyArray<AssetsCollection>,
    @Inject(ASSETS_COLLECTIONS_ORDER)
    assetsCollectionsOrder: typeof assetsCollectionsOrderJson,
    private jsonFetcher: JsonFetcher,
    @Inject(VIDEO_ASSETS_COLLECTION)
    private videoAssetsCollection: AssetsCollection,
    @Inject(LOOKBOOK_COLLECTION_SLUG) private lookbookCollectionSlug: string,
  ) {
    const assetsCollections = []
    const unsortedAssetsCollectionsBySlug = new Map(
      unsortedAssetsCollections.map((assetCollection) => [
        assetCollection.slug,
        assetCollection,
      ]),
    )
    for (const assetCollectionSlug of assetsCollectionsOrder.assetCollectionsOrder) {
      const assetCollection =
        unsortedAssetsCollectionsBySlug.get(assetCollectionSlug)
      if (assetCollection) {
        assetsCollections.push(assetCollection)
        unsortedAssetsCollectionsBySlug.delete(assetCollection.slug)
      }
    }
    this.assetsCollections = [
      ...assetsCollections,
      ...unsortedAssetsCollectionsBySlug.values(),
    ]
    this.orderByCollectionSlug = new Map(
      this.assetsCollections.map((assetsCollection, index) => [
        assetsCollection.slug,
        index,
      ]),
    )
  }

  byProject(project: Project): Observable<ReadonlyArray<AnyAssetsCollection>> {
    const videoAssetsCollections = this.getVideoAssetsCollections(project)
    const imageAssetsCollections = this.getImageAssetsCollections(
      project.slug,
      project.lookbookNamesAndSlugs ?? [],
    )
    return imageAssetsCollections.pipe(
      map((imageAssetsCollections) => [
        ...imageAssetsCollections,
        ...videoAssetsCollections,
      ]),
      map((allCollections) =>
        allCollections.sort(
          (a, b) =>
            (this.orderByCollectionSlug.get(a.slug) ??
              this.assetsCollections.length) -
            (this.orderByCollectionSlug.get(b.slug) ??
              this.assetsCollections.length),
        ),
      ),
    )
  }

  private getVideoAssetsCollections(
    project: Project,
  ): ReadonlyArray<VideoAssetsCollection> {
    if (!project.youtubePlaylistId) {
      return []
    }
    return [
      {
        ...this.videoAssetsCollection,
        type: 'video',
        youtubePlaylist: new YoutubePlaylist(project.youtubePlaylistId),
      },
    ]
  }

  private getImageAssetsCollections(
    slug: string,
    lookbookNamesAndSlugs: ReadonlyArray<LookbookNameAndSlug>,
  ): Observable<ReadonlyArray<ImageAssetsCollection>> {
    return from(
      this.jsonFetcher.fetch<ReadonlyArray<ImageAsset>>(
        PROJECTS_DIR,
        slug,
        'images.json',
      ),
    ).pipe(
      map((imageAssets) =>
        this.mapImageAssetsToCollections(
          imageAssets,
          slug,
          lookbookNamesAndSlugs,
        ),
      ),
    )
  }

  private mapImageAssetsToCollections(
    imageAssets: ReadonlyArray<ImageAsset>,
    slug: string,
    lookbookNamesAndSlugs: ReadonlyArray<LookbookNameAndSlug>,
  ): ReadonlyArray<ImageAssetsCollection> {
    const projectImageAssets = imageAssets.map(
      (imageAsset) => new ProjectImageAsset(imageAsset, slug),
    )
    const projectImageAssetsByCollectionSlug = new Map<
      string,
      ReadonlyArray<ProjectImageAsset>
    >()
    for (const projectImageAsset of projectImageAssets) {
      const collection = projectImageAsset.collection
      const assetsInCollection =
        projectImageAssetsByCollectionSlug.get(collection) ?? []
      projectImageAssetsByCollectionSlug.set(collection, [
        ...assetsInCollection,
        projectImageAsset,
      ])
    }
    const assetCollections: ImageAssetsCollection[] = []
    for (const assetCollection of this.assetsCollections) {
      const projectImageAssets = projectImageAssetsByCollectionSlug.get(
        assetCollection.slug,
      )
      if (projectImageAssets && projectImageAssets.length > 0) {
        if (assetCollection.slug === this.lookbookCollectionSlug) {
          const projectImageAssetsBySubcollectionSlug = new Map<
            string,
            ReadonlyArray<ProjectImageAsset>
          >()
          for (const projectImageAsset of projectImageAssets) {
            const subCollection = projectImageAsset.subCollection
            const assetsInCollection =
              projectImageAssetsBySubcollectionSlug.get(subCollection) ?? []
            projectImageAssetsBySubcollectionSlug.set(subCollection, [
              ...assetsInCollection,
              projectImageAsset,
            ])
          }
          const lookbookCollections: ImageAssetsCollection[] = []
          let index = 1
          for (const lookbookNameAndSlug of lookbookNamesAndSlugs) {
            const subcollectionImageAssets =
              projectImageAssetsBySubcollectionSlug.get(
                lookbookNameAndSlug.slug,
              )
            if (
              subcollectionImageAssets &&
              subcollectionImageAssets.length > 0
            ) {
              lookbookCollections.push({
                ...assetCollection,
                type: 'image',
                name: `${assetCollection.name} ${index} "${lookbookNameAndSlug.name}"`,
                images: subcollectionImageAssets.map(({ asset }) => asset),
              })
              projectImageAssetsBySubcollectionSlug.delete(
                lookbookNameAndSlug.slug,
              )
              index++
            }
          }
          const restOfLookbookImages = Array.from(
            projectImageAssetsBySubcollectionSlug.values(),
          )
            .flat()
            .map(({ asset }) => asset)
          if (restOfLookbookImages.length > 0) {
            lookbookCollections.push({
              ...assetCollection,
              type: 'image',
              name: `${assetCollection.name} ${index}`,
              images: restOfLookbookImages,
            })
          }
          assetCollections.push(...lookbookCollections)
          projectImageAssetsByCollectionSlug.delete(assetCollection.slug)
        } else {
          assetCollections.push({
            ...assetCollection,
            type: 'image',
            images: projectImageAssets.map(({ asset }) => asset),
          })
          projectImageAssetsByCollectionSlug.delete(assetCollection.slug)
        }
      }
    }
    const restOfImages = Array.from(projectImageAssetsByCollectionSlug.values())
      .flat()
      .map(({ asset }) => asset)
    if (restOfImages.length > 0) {
      assetCollections.push({
        type: 'image',
        name: 'Other images',
        slug: 'other',
        size: 'full',
        images: restOfImages,
      })
    }
    return assetCollections
  }
}

const ASSETS_COLLECTIONS = new InjectionToken<ReadonlyArray<AssetsCollection>>(
  'Assets collections',
  { factory: () => assetsCollectionsJson as ReadonlyArray<AssetsCollection> },
)

const ASSETS_COLLECTIONS_ORDER = new InjectionToken<
  typeof assetsCollectionsOrderJson
>('Assets collections order', { factory: () => assetsCollectionsOrderJson })

const VIDEO_ASSETS_COLLECTION = new InjectionToken<AssetsCollection>(
  'Video assets collection',
  { factory: () => videoCollectionJson as AssetsCollection },
)

const LOOKBOOK_COLLECTION_SLUG = new InjectionToken<string>(
  'Lookbooks assets collections slug',
  { factory: () => lookbookCollection.slug },
)
