import { InjectionToken } from '@angular/core'
import miscImages from '@/data/generated/misc-images.json'
import { ImageAsset } from './image-asset'

export const MISC_IMAGES = new InjectionToken<MiscImages>(
  'Miscellaneous images',
  {
    factory: () => miscImages,
  },
)

//👇 Optional so we can run tests without looking for real images
export type MiscImages = Partial<{
  horizontalLogo?: ImageAsset
  aboutPortrait?: ImageAsset
}>
