import { ImageAsset } from '../../common/images/image-asset'

export interface Lookbook {
  readonly slug: string
  readonly images: ReadonlyArray<ImageAsset>
  readonly name?: string
}
