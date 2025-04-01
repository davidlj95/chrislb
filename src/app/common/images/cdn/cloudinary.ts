import { provideCloudinaryLoader } from '@angular/common'

export const CDN_NAME = 'cloudinary'
export const BASE_URL = 'https://res.cloudinary.com/'
export const CLOUD_NAME = 'chrislb'
export const URL = `${BASE_URL}${CLOUD_NAME}`
export const provideResponsiveImageLoader = () => provideCloudinaryLoader(URL)
