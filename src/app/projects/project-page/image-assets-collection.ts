import { ImageAsset } from '../../common/images/image-asset'
import { AssetsCollectionType } from './assets-collection-type'
import { AssetsCollection } from './assets-collection'
import { AssetsCollectionData } from './assets-collection-data'

export class ImageAssetsCollection implements AssetsCollection {
  readonly type = AssetsCollectionType.Image

  constructor(
    readonly data: AssetsCollectionData,
    readonly images: readonly ImageAsset[],
  ) {}
}
