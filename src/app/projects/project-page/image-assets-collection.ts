import { ImageAsset } from '../../common/images/image-asset'
import { AssetsCollection } from './assets-collection'

export interface ImageAssetsCollection extends AssetsCollection {
  readonly type: 'image'
  readonly images: ReadonlyArray<ImageAsset>
}
