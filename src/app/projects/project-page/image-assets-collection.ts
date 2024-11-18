import { ImageAsset } from '../../common/images/image-asset'
import { AssetsCollectionType } from './assets-collection-type'
import { AssetsCollection } from './assets-collection'
import { AssetsCollectionData } from './assets-collection-data'

export class ImageAssetsCollection implements AssetsCollection {
  public readonly type = AssetsCollectionType.Image

  constructor(
    public readonly data: AssetsCollectionData,
    public readonly images: readonly ImageAsset[],
  ) {}
}
