import { IMAGE_LOADER, ImageLoader } from '@angular/common'
import { Provider } from '@angular/core'
import { LoaderParams } from '@/app/common/images/image'
import { isDefined } from '@/app/common/is-defined'

export const CDN_NAME = 'cloudinary'
export const BASE_URL = 'https://res.cloudinary.com/'
export const CLOUD_NAME = 'chrislb'
export const CLOUD_URL = `${BASE_URL}${CLOUD_NAME}`
export const provideResponsiveImageLoader = (): Provider => ({
  provide: IMAGE_LOADER,
  useValue: cloudinaryImageLoader,
})

export const IMAGE_DELIVERY_TYPE = 'authenticated'

const cloudinaryImageLoader: ImageLoader = (config) => {
  const loaderParams = (config.loaderParams ?? {}) as LoaderParams

  const signature = config.width
    ? (loaderParams.signaturesByBreakpoint ?? {})[config.width.toString()]
    : undefined

  const widthTransformation = config.width ? `w_${config.width}` : undefined

  return [
    CLOUD_URL,
    'image',
    IMAGE_DELIVERY_TYPE,
    signature,
    [...ANTE_TRANSFORMATIONS, widthTransformation].filter(isDefined).join(','),
    config.src,
  ]
    .filter(isDefined)
    .join('/')
}

//👇 Applying default transformations from Angular built-in loader
// https://github.com/angular/angular/blob/19.2.5/packages/common/src/directives/ng_optimized_image/image_loaders/cloudinary_loader.ts#L58-L60
export const ANTE_TRANSFORMATIONS = ['q_auto', 'f_auto']
