import { InjectionToken } from '@angular/core'
import miscImages from '../../../data/images/misc.json'
import { ImageAsset } from './image-asset'

export const MISC_IMAGES = new InjectionToken<MiscImages>(
  'Miscellaneous images',
  {
    factory: () => miscImages,
  },
)

export interface MiscImages {
  horizontalLogo: ImageAsset
  aboutPortrait: ImageAsset
}
