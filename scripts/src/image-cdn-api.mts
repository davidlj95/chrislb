import { ImageAsset } from '../../src/app/common/images/image-asset.js'

export interface ImageCdnApi {
  getAllImagesInPath(
    path: string,
    includeSubdirectories?: boolean,
  ): Promise<ReadonlyArray<ImageAsset>>
}
