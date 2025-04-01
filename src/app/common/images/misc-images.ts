import MISC_IMAGES_JSON from '@/data/generated/misc-images.json'
import { ResponsiveImage } from './responsive-image'

export const MISC_IMAGES: MiscImages = MISC_IMAGES_JSON

//👇 Optional so we can run tests without looking for real images
export type MiscImages = Partial<{
  horizontalLogo?: ResponsiveImage
  aboutPortrait?: ResponsiveImage
}>
