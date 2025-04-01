// 👇 Needs to be here, first line.
//    Because of image CDN config exporting Angular providers
import '@angular/compiler'
import { Cloudinary } from './cloudinary'
import { ImageCdnApi } from './image-cdn-api'
import { Imagekit } from './imagekit'
import { CDN_NAME, CdnNames } from '../../../src/app/common/images/cdn/index'
import { Log } from '../utils/log'

const CDN_APIS_BY_NAME: Record<CdnNames, () => ImageCdnApi> = {
  imagekit: Imagekit.fromEnv,
  cloudinary: Cloudinary.fromEnv,
}
export const getImageCdnApi = (): ImageCdnApi => {
  Log.info(`Using ${CDN_NAME} as image CDN`)
  return CDN_APIS_BY_NAME[CDN_NAME]()
}
