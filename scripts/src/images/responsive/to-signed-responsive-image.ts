import { Image, ResponsiveImage } from '@/app/common/images/image'
import { SourceSizeList } from '../models/source-size-list'
import { ImageCdnApi } from '../cdn'
import { signResponsiveImage } from './sign-responsive-image'
import {
  toResponsiveImage,
  ToResponsiveImageOpts,
  toResponsiveImages,
} from './to-responsive-image'

export const toSignedResponsiveImage = async (
  image: Image,
  sourceSizeList: SourceSizeList,
  imageCdnApi: ImageCdnApi,
  opts: ToResponsiveImageOpts = {},
): Promise<ResponsiveImage> =>
  signResponsiveImage(
    await toResponsiveImage(image, sourceSizeList, opts),
    imageCdnApi,
  )

export const toSignedResponsiveImages = async (
  images: readonly Image[],
  sourceSizeList: SourceSizeList,
  imageCdnApi: ImageCdnApi,
): Promise<readonly ResponsiveImage[]> =>
  Promise.all(
    (await toResponsiveImages(images, sourceSizeList)).map((responsiveImage) =>
      signResponsiveImage(responsiveImage, imageCdnApi),
    ),
  )
