import { ImageAsset } from '../../src/app/common/images/types.js'

export interface ImageCdnApi {
  getAllImagesInPath(
    path: string,
    includeSubdirectories?: boolean,
  ): Promise<ReadonlyArray<ImageAsset>>
}
