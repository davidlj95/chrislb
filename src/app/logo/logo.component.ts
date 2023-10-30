import { Component, Inject, InjectionToken } from '@angular/core'
import { LogoImages } from '../common/images/types'
import logoImages from '../../data/images/logos.json'
import { ImageResponsiveBreakpointsService } from '../common/image-responsive-breakpoints.service'
import { ImageResponsiveBreakpoints } from '../common/image-responsive-breakpoints'

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

  constructor(
    @Inject(LOGO_IMAGES) public logoImages: LogoImages,
    private imageResponsiveBreakpointsService: ImageResponsiveBreakpointsService,
  ) {}
}

const LOGO_IMAGES = new InjectionToken<LogoImages>('Logo images', {
  factory: () => logoImages,
})
