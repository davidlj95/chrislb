import {
  Image,
  ResponsiveImage,
  ResponsiveImageBreakpoints,
} from '@/app/common/images/image'
import { SourceSizeList } from '../../models/source-size-list'
import { breakpointsFromSizesAndImage } from '../breakpoints-from-sizes-and-image'
import { Log } from '../../utils/log'

export abstract class ImageCdnApi {
  abstract getAllImagesInPath(
    path: string,
    includeSubdirectories?: boolean,
  ): Promise<readonly Image[]>

  async responsiveImage(
    image: Image,
    sourceSizeList: SourceSizeList,
    opts: Partial<{
      withoutSizes: boolean
    }> = {},
  ): Promise<ResponsiveImage> {
    const responsiveImageWithoutSizes = {
      ...image,
      breakpoints: await this._breakpointsForImage(image, sourceSizeList),
    }
    if (
      responsiveImageWithoutSizes.breakpoints.length >
      MAX_RECOMMENDED_BREAKPOINTS
    ) {
      Log.warn(
        `Too many breakpoints generated for image "%s": %d`,
        image.src,
        responsiveImageWithoutSizes.breakpoints.length,
      )
    }
    if (opts.withoutSizes) {
      return responsiveImageWithoutSizes
    }
    return {
      ...responsiveImageWithoutSizes,
      sizes: sourceSizeList.toString(),
    }
  }

  protected async _breakpointsForImage(
    image: Image,
    sourceSizeList: SourceSizeList,
  ): Promise<ResponsiveImageBreakpoints> {
    return breakpointsFromSizesAndImage(sourceSizeList, image)
  }
}

export const UNPUBLISHED_TAG = 'unpublished'

const MAX_RECOMMENDED_BREAKPOINTS = 20
