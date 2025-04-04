import {
  areBreakpointsUnsigned,
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
    breakpoints.map<Promise<[string, string]>>(async (breakpoint) => [
      breakpoint.toString(),
      await imageCdnApi.signImageBreakpoint(responsiveImage, breakpoint),
    ]),
  )
  return {
    ...baseResponsiveImage,
    breakpoints: Object.fromEntries(breakpointsAndSignatures),
  }
}
