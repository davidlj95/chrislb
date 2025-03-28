import { Component, Inject } from '@angular/core'
import { MISC_IMAGES, MiscImages } from '../common/images/misc-images'
import { ResponsiveImage } from '../common/images/responsive-image'
import { ResponsiveImageAttributesService } from '../common/images/responsive-image-attributes.service'
import { Px } from '../common/css/unit/px'
import { NgOptimizedImage } from '@angular/common'
import { RouterLink } from '@angular/router'

@Component({
  selector: 'app-logo',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.scss'],
  standalone: true,
  imports: [RouterLink, NgOptimizedImage],
})
export class LogoComponent {
  protected readonly _horizontalLogo?: ResponsiveImage
  // 👇 Keep in sync with SCSS for responsive sizing
  protected readonly _LOGO_MAX_HEIGHT_PX = 55

  constructor(
    @Inject(MISC_IMAGES) miscImages: MiscImages,
    responsiveImageAttributesService: ResponsiveImageAttributesService,
  ) {
    const horizontalLogoAsset = miscImages.horizontalLogo
    if (horizontalLogoAsset) {
      const aspectRatio = horizontalLogoAsset.width / horizontalLogoAsset.height
      const maxWidthPx = aspectRatio * this._LOGO_MAX_HEIGHT_PX
      this._horizontalLogo = new ResponsiveImage(
        horizontalLogoAsset,
        responsiveImageAttributesService
          .fullWidthUntil(Px(Math.ceil(maxWidthPx)))
          .reduce(),
      )
    }
  }
}
