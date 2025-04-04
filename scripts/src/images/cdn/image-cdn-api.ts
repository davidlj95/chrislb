import { Image } from '@/app/common/images/image'

export abstract class ImageCdnApi {
  abstract getAllImagesInPath(
    path: string,
    includeSubdirectories?: boolean,
  ): Promise<readonly Image[]>

  abstract signImageBreakpoint(
    image: Image,
    breakpoint: number,
  ): Promise<string>
}

export const UNPUBLISHED_TAG = 'unpublished'
