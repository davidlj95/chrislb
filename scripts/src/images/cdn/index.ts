// 👇 Needs to be here, first line.
//    Because of image CDN config exporting Angular providers
import '@angular/compiler'
import { Cloudinary } from './apis/cloudinary'
import { Imagekit } from './apis/imagekit'
import { CDN_NAME, CdnNames } from '@/app/common/images/cdn'
import { Log } from '../../utils/log'
import type { ImageCdnApi } from './image-cdn-api'

const CDN_APIS_BY_NAME: Record<CdnNames, () => Promise<ImageCdnApi>> = {
  imagekit: async () => Imagekit.fromEnv(),
  cloudinary: Cloudinary.fromEnv,
}
export const getImageCdnApi = (): Promise<ImageCdnApi> => {
  Log.info(`Using ${CDN_NAME} as image CDN`)
  return CDN_APIS_BY_NAME[CDN_NAME]()
}

export { ImageCdnApi }
