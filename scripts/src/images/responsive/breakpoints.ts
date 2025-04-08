import { Breakpoints, Image } from '@/app/common/images/image'
import { SourceSizeList } from '../models/source-size-list'
import { CDN_NAME } from '@/app/common/images/cdn'
import { CDN_NAME as CLOUDINARY_CDN_NAME } from '@/app/common/images/cdn/cloudinary'
import { Cloudinary } from '../cdn/apis/cloudinary'
import { breakpointsFromSizesAndDimensions } from './breakpoints-from-sizes-and-dimensions'

export type BreakpointsFn = (
  image: Image,
  sourceSizeList: SourceSizeList,
) => Promise<Breakpoints>

export const getBreakpointsFn = async (): Promise<BreakpointsFn> => {
  // eslint-disable-next-line
  // @ts-ignore
  if (CDN_NAME === CLOUDINARY_CDN_NAME) {
    return getCloudinaryResponsiveBreakpointsApi()
  }
  return getBreakpointsFromSizesAndDimensionsApi()
}

const getCloudinaryResponsiveBreakpointsApi =
  async (): Promise<BreakpointsFn> => {
    const cloudinaryApi = await Cloudinary.getInstance()
    return cloudinaryApi.breakpointsForImage.bind(cloudinaryApi)
  }

const getBreakpointsFromSizesAndDimensionsApi =
  async (): Promise<BreakpointsFn> => async (image, sourceSizeList) =>
    breakpointsFromSizesAndDimensions(image, sourceSizeList)
