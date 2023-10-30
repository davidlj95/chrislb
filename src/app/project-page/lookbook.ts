import { ImageAsset } from '../../data/images/types'

export interface Lookbook {
  readonly slug: string
  readonly images: ReadonlyArray<ImageAsset>
  readonly name?: string
}
