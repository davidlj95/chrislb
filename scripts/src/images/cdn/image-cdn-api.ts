import { Image } from '@/app/common/images/image'

export abstract class ImageCdnApi {
  abstract getAllImagesInPath(
    path: string,
    includeSubdirectories?: boolean,
  ): Promise<readonly Image[]>
}

export const UNPUBLISHED_TAG = 'unpublished'
