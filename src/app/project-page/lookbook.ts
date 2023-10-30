import { ImageAsset } from '../common/images/types'

export interface Lookbook {
  readonly slug: string
  readonly images: ReadonlyArray<ImageAsset>
  readonly name?: string
}
