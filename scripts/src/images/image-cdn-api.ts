import { ImageAsset } from '../../../src/app/common/images/image-asset'

export interface ImageCdnApi {
  getAllImagesInPath(
    path: string,
    includeSubdirectories?: boolean,
  ): Promise<ReadonlyArray<ImageAsset>>
}
