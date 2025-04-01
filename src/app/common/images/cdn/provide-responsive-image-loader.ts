import { CDN_NAME } from './index'
import { URL as IMAGEKIT_URL } from './imagekit'
import { URL as CLOUDINARY_URL } from './cloudinary'
import { provideCloudinaryLoader, provideImageKitLoader } from '@angular/common'

export const provideResponsiveImageLoader = () =>
  // eslint-disable-next-line
  // @ts-ignore
  CDN_NAME === 'imagekit'
    ? provideImageKitLoader(IMAGEKIT_URL)
    : provideCloudinaryLoader(CLOUDINARY_URL)
