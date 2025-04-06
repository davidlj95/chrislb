import { IMAGE_LOADER, ImageLoader } from '@angular/common'
import { Provider } from '@angular/core'
import { getBreakpointSignatureFromLoaderConfig } from '@/app/common/images/image'
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
  return [
    CLOUD_URL,
    'image',
    IMAGE_DELIVERY_TYPE,
    getBreakpointSignatureFromLoaderConfig(config),
    getRawTransformationForBreakpoint(config.width),
    config.src,
  ]
    .filter(isDefined)
    .join('/')
}

//👇 Applying default transformations from Angular built-in loader
// https://github.com/angular/angular/blob/19.2.5/packages/common/src/directives/ng_optimized_image/image_loaders/cloudinary_loader.ts#L58-L60
export const getRawTransformationForBreakpoint = (
  width: number | undefined,
): string => {
  const widthTransformation = width ? `w_${width}` : undefined
  return ['q_auto', 'f_auto', widthTransformation].filter(isDefined).join(',')
}
