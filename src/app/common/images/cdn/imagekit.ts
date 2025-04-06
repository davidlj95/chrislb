import { IMAGE_LOADER, ImageLoader } from '@angular/common'
import { getBreakpointSignatureFromLoaderConfig } from '@/app/common/images/image'
import { isDefined } from '@/app/common/is-defined'

export const CDN_NAME = 'imagekit'
export const BASE_URL = 'https://ik.imagekit.io/'
const CLOUD_NAME = 'chrislb'
export const CLOUD_URL = `${BASE_URL}${CLOUD_NAME}`
export const provideResponsiveImageLoader = () => ({
  provide: IMAGE_LOADER,
  useValue: imageKitImageLoader,
})
const imageKitImageLoader: ImageLoader = (config) => {
  const widthTransformation = config.width ? `w-${config.width}` : undefined

  // https://github.com/angular/angular/blob/19.2.5/packages/common/src/directives/ng_optimized_image/image_loaders/imagekit_loader.ts
  const unsignedUrl = [
    CLOUD_URL,
    widthTransformation ? `tr:${widthTransformation}` : undefined,
    config.src.startsWith('/') ? config.src.substring(1) : config.src,
  ]
    .filter(isDefined)
    .join('/')

  const signature = getBreakpointSignatureFromLoaderConfig(config)
  if (!signature) return unsignedUrl

  // https://imagekit.io/docs/media-delivery-basic-security#how-to-generate-signed-urls
  const signedUrl = new URL(unsignedUrl)
  signedUrl.searchParams.set('ik-s', signature)
  return signedUrl.href
}
