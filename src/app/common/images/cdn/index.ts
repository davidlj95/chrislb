// 👇 To switch CDN
export { CDN_NAME, BASE_URL } from './cloudinary'

import { CDN_NAME as CLOUDINARY_NAME } from './cloudinary'
import { CDN_NAME as IMAGEKIT_NAME } from './imagekit'

export type CdnNames = typeof IMAGEKIT_NAME | typeof CLOUDINARY_NAME
