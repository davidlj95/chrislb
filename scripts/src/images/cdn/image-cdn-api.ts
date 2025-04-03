import { Image } from '@/app/common/images/image'

export interface ImageCdnApi {
  getAllImagesInPath(
    path: string,
    includeSubdirectories?: boolean,
  ): Promise<readonly Image[]>
}

export const UNPUBLISHED_TAG = 'unpublished'
