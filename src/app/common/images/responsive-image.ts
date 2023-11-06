import { ImageAsset } from './image-asset'
import { ResponsiveImageAttributes } from './responsive-image-attributes'

export class ResponsiveImage {
  constructor(
    public readonly asset: ImageAsset,
    public readonly attributes: ResponsiveImageAttributes,
  ) {}
}
