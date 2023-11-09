import { ImageAsset } from '../../src/app/common/images/image-asset.ts'

export interface ImageCdnApi {
  getAllImagesInPath(
    path: string,
    includeSubdirectories?: boolean,
  ): Promise<ReadonlyArray<ImageAsset>>
}
