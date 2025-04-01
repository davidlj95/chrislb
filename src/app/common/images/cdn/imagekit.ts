import { provideImageKitLoader } from '@angular/common'

export const CDN_NAME = 'imagekit'
export const BASE_URL = 'https://ik.imagekit.io/'
const CLOUD_NAME = 'chrislb'
export const URL = `${BASE_URL}${CLOUD_NAME}`
export const provideResponsiveImageLoader = () => provideImageKitLoader(URL)
