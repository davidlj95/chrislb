import { provideCloudinaryLoader } from '@angular/common'

export const CDN_NAME = 'cloudinary'
export const BASE_URL = 'https://res.cloudinary.com/'
export const CLOUD_NAME = 'chrislb'
export const URL = `${BASE_URL}${CLOUD_NAME}`
export const provideResponsiveImageLoader = () => provideCloudinaryLoader(URL)
//👇 Applying default transformations from Angular built-in loader
// https://github.com/angular/angular/blob/19.2.5/packages/common/src/directives/ng_optimized_image/image_loaders/cloudinary_loader.ts#L58-L60
export const ANTE_TRANSFORMATIONS = ['q_auto', 'f_auto']
