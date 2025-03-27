import {
  IS_IMAGE_CDN_CLOUDINARY,
  IS_IMAGE_CDN_IMAGEKIT,
} from '../../../src/app/common/images/cdn-config'
import { Cloudinary } from './cloudinary'
import { ImageCdnApi } from './image-cdn-api'
import { Imagekit } from './imagekit'

export const getImageCdnApi = (): ImageCdnApi => {
  if (IS_IMAGE_CDN_CLOUDINARY) {
    return Cloudinary.fromEnv()
  }
  if (IS_IMAGE_CDN_IMAGEKIT) {
    return Imagekit.fromEnv()
  }
  throw new Error('Unable to get image CDN API')
}
