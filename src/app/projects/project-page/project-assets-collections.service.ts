import { Inject, Injectable, InjectionToken } from '@angular/core'
import { Project } from '../project'
import { VideoAssetsCollection } from './video-assets-collection'
import { YoutubePlaylist } from './youtube-playlist'
import { from, map, Observable } from 'rxjs'
import { AnyAssetsCollection } from './any-asset-collection'
import { AssetsCollectionData } from './assets-collection-data'
import assetsCollectionsJson from '../../../data/assets-collections.json'
import assetsCollectionsOrderJson from '../../../data/misc/assets-collections-order.json'
import lookbookCollectionJson from '../../../data/assets-collections/lookbooks.json'
import videoCollectionJson from '../../../data/assets-collections/videos.json'
import { ImageAssetsCollection } from './image-assets-collection'
import { JsonFetcher } from '../../common/json-fetcher/json-fetcher'
import { PROJECTS_DIR } from '../../common/directories'
import { ImageAsset } from '../../common/images/image-asset'
import { ProjectImageAsset } from './project-image-asset'
import { LookbookNameAndSlug } from '../lookbook-name-and-slug'
import { AssetsCollectionSize } from './assets-collection-size'
import { IMAGES_FILENAME } from '../../common/files'

@Injectable()
export class ProjectAssetsCollectionsService {
  private readonly assetsCollectionsData: ReadonlyArray<AssetsCollectionData>
  private readonly orderByCollectionSlug: Map<string, number>

  constructor(
    @Inject(ASSETS_COLLECTIONS_DATA)
    unsortedAssetsCollections: ReadonlyArray<AssetsCollectionData>,
    @Inject(ASSETS_COLLECTIONS_ORDER)
    assetsCollectionsOrder: typeof assetsCollectionsOrderJson,
    private readonly jsonFetcher: JsonFetcher,
    @Inject(VIDEO_ASSETS_COLLECTION)
    private readonly videoAssetsCollection: AssetsCollectionData,
    @Inject(LOOKBOOK_COLLECTION_SLUG)
    private readonly lookbookCollectionSlug: string,
  ) {
    const assetsCollectionsData = []
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
        assetsCollectionsData.push(assetCollection)
        unsortedAssetsCollectionsBySlug.delete(assetCollection.slug)
      }
    }
    this.assetsCollectionsData = [
      ...assetsCollectionsData,
      ...unsortedAssetsCollectionsBySlug.values(),
    ]
    this.orderByCollectionSlug = new Map(
      this.assetsCollectionsData.map((assetsCollection, index) => [
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
            (this.orderByCollectionSlug.get(a.data.slug) ??
              this.assetsCollectionsData.length) -
            (this.orderByCollectionSlug.get(b.data.slug) ??
              this.assetsCollectionsData.length),
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
      new VideoAssetsCollection(
        this.videoAssetsCollection,
        new YoutubePlaylist(project.youtubePlaylistId),
      ),
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
        IMAGES_FILENAME,
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
    for (const assetCollection of this.assetsCollectionsData) {
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
              lookbookCollections.push(
                new ImageAssetsCollection(
                  {
                    ...assetCollection,
                    name: `${assetCollection.name} ${index} "${lookbookNameAndSlug.name}"`,
                  },
                  subcollectionImageAssets.map(({ asset }) => asset),
                ),
              )
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
            lookbookCollections.push(
              new ImageAssetsCollection(
                {
                  ...assetCollection,
                  name: `${assetCollection.name} ${index}`,
                },
                restOfLookbookImages,
              ),
            )
          }
          assetCollections.push(...lookbookCollections)
          projectImageAssetsByCollectionSlug.delete(assetCollection.slug)
        } else {
          assetCollections.push(
            new ImageAssetsCollection(
              assetCollection,
              projectImageAssets.map(({ asset }) => asset),
            ),
          )
          projectImageAssetsByCollectionSlug.delete(assetCollection.slug)
        }
      }
    }
    const restOfImages = Array.from(projectImageAssetsByCollectionSlug.values())
      .flat()
      .map(({ asset }) => asset)
    if (restOfImages.length > 0) {
      assetCollections.push(
        new ImageAssetsCollection(
          {
            name: 'Other images',
            slug: 'other',
            size: AssetsCollectionSize.Full,
          },
          restOfImages,
        ),
      )
    }
    return assetCollections
  }
}

const ASSETS_COLLECTIONS_DATA = new InjectionToken<
  ReadonlyArray<AssetsCollectionData>
>('Assets collections', {
  factory: () => assetsCollectionsJson as ReadonlyArray<AssetsCollectionData>,
})

const ASSETS_COLLECTIONS_ORDER = new InjectionToken<
  typeof assetsCollectionsOrderJson
>('Assets collections order', { factory: () => assetsCollectionsOrderJson })

const VIDEO_ASSETS_COLLECTION = new InjectionToken<AssetsCollectionData>(
  'Video assets collection',
  { factory: () => videoCollectionJson as AssetsCollectionData },
)

const LOOKBOOK_COLLECTION_SLUG = new InjectionToken<string>(
  'Lookbooks assets collections slug',
  { factory: () => lookbookCollectionJson.slug },
)
