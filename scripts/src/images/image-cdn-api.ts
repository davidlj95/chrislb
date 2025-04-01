import { ImageAsset } from '@/app/common/images/image-asset'

export interface ImageCdnApi {
  getAllImagesInPath(
    path: string,
    includeSubdirectories?: boolean,
  ): Promise<readonly ImageAsset[]>
}

export const UNPUBLISHED_TAG = 'unpublished'
