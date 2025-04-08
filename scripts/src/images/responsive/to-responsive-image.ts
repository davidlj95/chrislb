import { Image, ResponsiveImage } from '@/app/common/images/image'
import { SourceSizeList } from '../models/source-size-list'
import { Log } from '../../utils/log'
import { getBreakpointsFn } from './breakpoints'
import { resolveSequentially } from '../../utils/resolve-sequentially'

export const toResponsiveImage = async (
  image: Image,
  sourceSizeList: SourceSizeList,
  opts: ToResponsiveImageOpts = {},
): Promise<ResponsiveImage> => {
  const breakpointsFunction = await getBreakpointsFn()
  const responsiveImageWithoutSizes = {
    ...image,
    breakpoints: await breakpointsFunction(image, sourceSizeList),
  }
  if (
    responsiveImageWithoutSizes.breakpoints.length > MAX_RECOMMENDED_BREAKPOINTS
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

export type ToResponsiveImageOpts = Partial<{ withoutSizes: boolean }>

export const toResponsiveImages = async (
  images: readonly Image[],
  sourceSizeList: SourceSizeList,
): Promise<readonly ResponsiveImage[]> => {
  return resolveSequentially(
    images.map((image) =>
      toResponsiveImage(image, sourceSizeList, { withoutSizes: true }),
    ),
  )
}

const MAX_RECOMMENDED_BREAKPOINTS = 20
