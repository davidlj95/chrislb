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
import { groupBy, isEmpty } from 'lodash-es'

@Injectable()
export class ProjectAssetsCollectionsService {
  private readonly _assetsCollectionsData: readonly AssetsCollectionData[]
  private readonly _orderByCollectionSlug: Map<string, number>

  constructor(
    @Inject(ASSETS_COLLECTIONS_DATA)
    unsortedAssetsCollections: readonly AssetsCollectionData[],
    @Inject(ASSETS_COLLECTIONS_ORDER)
    assetsCollectionsOrder: typeof assetsCollectionsOrderJson,
    private readonly _jsonFetcher: JsonFetcher,
    @Inject(VIDEO_ASSETS_COLLECTION)
    private readonly _videoAssetsCollection: AssetsCollectionData,
    @Inject(LOOKBOOK_COLLECTION_SLUG)
    private readonly _lookbookCollectionSlug: string,
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
    this._assetsCollectionsData = [
      ...assetsCollectionsData,
      ...unsortedAssetsCollectionsBySlug.values(),
    ]
    this._orderByCollectionSlug = new Map(
      this._assetsCollectionsData.map((assetsCollection, index) => [
        assetsCollection.slug,
        index,
      ]),
    )
  }

  byProject(project: Project): Observable<readonly AnyAssetsCollection[]> {
    const videoAssetsCollections = this._getVideoAssetsCollections(project)
    const imageAssetsCollections = this._getImageAssetsCollections(
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
            (this._orderByCollectionSlug.get(a.data.slug) ??
              this._assetsCollectionsData.length) -
            (this._orderByCollectionSlug.get(b.data.slug) ??
              this._assetsCollectionsData.length),
        ),
      ),
    )
  }

  private _getVideoAssetsCollections(
    project: Project,
  ): readonly VideoAssetsCollection[] {
    if (!project.youtubePlaylistId) {
      return []
    }
    return [
      new VideoAssetsCollection(
        this._videoAssetsCollection,
        new YoutubePlaylist(project.youtubePlaylistId),
      ),
    ]
  }

  private _getImageAssetsCollections(
    slug: string,
    lookbookNamesAndSlugs: readonly LookbookNameAndSlug[],
  ): Observable<readonly ImageAssetsCollection[]> {
    return from(
      this._jsonFetcher.fetch<readonly ImageAsset[]>(
        PROJECTS_DIR,
        slug,
        IMAGES_FILENAME,
      ),
    ).pipe(
      map((imageAssets) =>
        this._mapImageAssetsToCollections(
          imageAssets,
          slug,
          lookbookNamesAndSlugs,
        ),
      ),
    )
  }

  private _mapImageAssetsToCollections(
    imageAssets: readonly ImageAsset[],
    slug: string,
    lookbookNamesAndSlugs: readonly LookbookNameAndSlug[],
  ): readonly ImageAssetsCollection[] {
    const projectImageAssets = imageAssets.map(
      (imageAsset) => new ProjectImageAsset(imageAsset, slug),
    )
    const projectImageAssetsByCollectionSlug = groupBy(
      projectImageAssets,
      (projectImageAsset) => projectImageAsset.collection,
    )
    const assetCollections: ImageAssetsCollection[] = []
    for (const assetCollection of this._assetsCollectionsData) {
      const projectImageAssets =
        projectImageAssetsByCollectionSlug[assetCollection.slug]
      if (!isEmpty(projectImageAssets)) {
        if (assetCollection.slug === this._lookbookCollectionSlug) {
          const projectImageAssetsBySubcollectionSlug = groupBy(
            projectImageAssets,
            (projectImageAsset) => projectImageAsset.subCollection,
          )
          const lookbookCollections: ImageAssetsCollection[] = []
          let index = 1
          for (const lookbookNameAndSlug of lookbookNamesAndSlugs) {
            const subcollectionImageAssets =
              projectImageAssetsBySubcollectionSlug[lookbookNameAndSlug.slug]
            if (!isEmpty(subcollectionImageAssets)) {
              lookbookCollections.push(
                new ImageAssetsCollection(
                  {
                    ...assetCollection,
                    name: `${assetCollection.name} ${index} "${lookbookNameAndSlug.name}"`,
                  },

                  subcollectionImageAssets!.map(({ asset }) => asset),
                ),
              )
              delete projectImageAssetsBySubcollectionSlug[
                lookbookNameAndSlug.slug
              ]
              index++
            }
          }
          const restOfLookbookImages = Array.from(
            Object.values(projectImageAssetsBySubcollectionSlug),
          )
            .flat()
            .map(({ asset }) => asset)
          if (!isEmpty(restOfLookbookImages)) {
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
          delete projectImageAssetsByCollectionSlug[assetCollection.slug]
        } else {
          assetCollections.push(
            new ImageAssetsCollection(
              assetCollection,

              projectImageAssets!.map(({ asset }) => asset),
            ),
          )
          delete projectImageAssetsByCollectionSlug[assetCollection.slug]
        }
      }
    }
    const restOfImages = Array.from(
      Object.values(projectImageAssetsByCollectionSlug),
    )
      .flat()
      .map(({ asset }) => asset)
    if (!isEmpty(restOfImages)) {
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
  readonly AssetsCollectionData[]
>('Assets collections', {
  factory: () => assetsCollectionsJson as readonly AssetsCollectionData[],
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
