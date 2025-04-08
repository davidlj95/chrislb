import {
  areBreakpointsUnsigned,
  ORIGINAL_SRC_BREAKPOINT,
  ResponsiveImage,
} from '@/app/common/images/image'
import { Log } from '../../utils/log'
import { ImageCdnApi } from '../cdn'

export const signResponsiveImage = async (
  responsiveImage: ResponsiveImage,
  imageCdnApi: ImageCdnApi,
): Promise<ResponsiveImage> => {
  if (!areBreakpointsUnsigned(responsiveImage.breakpoints)) {
    Log.warn('Breakpoints are already signed')
    return responsiveImage
  }
  const { breakpoints, ...baseResponsiveImage } = responsiveImage
  const breakpointsAndSignatures = await Promise.all(
    [undefined, ...breakpoints].map<Promise<[string, string]>>(
      async (breakpoint) => [
        (breakpoint ?? ORIGINAL_SRC_BREAKPOINT).toString(),
        await imageCdnApi.getUrlSignature(responsiveImage.src, { breakpoint }),
      ],
    ),
  )
  return {
    ...baseResponsiveImage,
    breakpoints: Object.fromEntries(breakpointsAndSignatures),
  }
}
