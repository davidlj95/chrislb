import { Inject, Injectable, InjectionToken } from '@angular/core'
import { ImageAsset } from '../../data/images/types'
import logoImages from '../../data/images/logos.json'

@Injectable({
  providedIn: 'root',
})
export class LogoImagesService {
  constructor(@Inject(LOGO_IMAGES_JSON) private logoImages: LogoImages) {}

  public get horizontal(): ImageAsset {
    return this.logoImages.horizontal
  }
}

const LOGO_IMAGES_JSON = new InjectionToken<LogoImages>('Logo images JSON', {
  factory: () => logoImages,
})
type LogoImages = typeof logoImages
