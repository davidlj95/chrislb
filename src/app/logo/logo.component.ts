import { Component, Inject } from '@angular/core'
import { ImageResponsiveBreakpointsService } from '../common/image-responsive-breakpoints.service'
import { ImageResponsiveBreakpoints } from '../common/image-responsive-breakpoints'
import { MISC_IMAGES, MiscImages } from '../common/images/misc-images'
import { ImageAsset } from '../common/images/image-asset'

@Component({
  selector: 'app-logo',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.scss'],
})
export class LogoComponent {
  // 👇 Those 2 obtained using https://ausi.github.io/respimagelint/
  protected readonly LOGO_MAX_WIDTH_PX = 674
  protected readonly sizes = `${this.LOGO_MAX_WIDTH_PX}px, 92.27vw`
  protected readonly srcSet = new ImageResponsiveBreakpoints(
    this.imageResponsiveBreakpointsService
      .range(
        this.imageResponsiveBreakpointsService.MIN_SCREEN_WIDTH_PX,
        this.LOGO_MAX_WIDTH_PX,
      )
      .pxValues.concat(this.LOGO_MAX_WIDTH_PX),
  ).toSrcSet()
  protected readonly horizontalLogo: ImageAsset

  constructor(
    @Inject(MISC_IMAGES) miscImages: MiscImages,
    private imageResponsiveBreakpointsService: ImageResponsiveBreakpointsService,
  ) {
    this.horizontalLogo = miscImages.horizontalLogo
  }
}
