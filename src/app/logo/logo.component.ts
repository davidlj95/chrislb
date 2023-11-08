import { Component, Inject } from '@angular/core'
import { MISC_IMAGES, MiscImages } from '../common/images/misc-images'
import { ResponsiveImage } from '../common/images/responsive-image'
import { ResponsiveImageAttributesService } from '../common/images/responsive-image-attributes.service'
import { Px } from '../common/css/unit/px'

@Component({
  selector: 'app-logo',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.scss'],
})
export class LogoComponent {
  protected readonly horizontalLogo: ResponsiveImage
  // 👇 Keep in sync with SCSS for responsive sizing
  protected readonly LOGO_MAX_HEIGHT_PX = 100

  constructor(
    @Inject(MISC_IMAGES) miscImages: MiscImages,
    responsiveImageAttributesService: ResponsiveImageAttributesService,
  ) {
    const horizontalLogoAsset = miscImages.horizontalLogo
    const aspectRatio = horizontalLogoAsset.width / horizontalLogoAsset.height
    const maxWidthPx = aspectRatio * this.LOGO_MAX_HEIGHT_PX
    this.horizontalLogo = new ResponsiveImage(
      miscImages.horizontalLogo,
      responsiveImageAttributesService.fullWidthUntil(
        Px(Math.ceil(maxWidthPx)),
      ),
    )
  }
}
