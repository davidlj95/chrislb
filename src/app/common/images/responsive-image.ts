import { ImageAsset } from './image-asset'
import { ResponsiveImageAttributes } from './responsive-image-attributes'

export class ResponsiveImage {
  constructor(
    readonly asset: ImageAsset,
    readonly attributes: ResponsiveImageAttributes,
  ) {}
}
