import { ImageAsset } from '../../common/images/image-asset'
import { AssetsCollection } from './assets-collection'

export interface ImageAssetsCollection extends AssetsCollection {
  readonly images: ReadonlyArray<ImageAsset>
}
