import { Inject, Injectable } from '@angular/core'
import { IMAGE_CONFIG, ImageConfig } from '@angular/common'
import { ImageResponsiveBreakpoints } from './image-responsive-breakpoints'

@Injectable({
  providedIn: 'root',
})
export class ImageResponsiveBreakpointsService {
  // 👇 Makes Lighthouse happy :)
  private readonly CUSTOM_BREAKPOINTS = [320]

  private readonly ALL_BREAKPOINTS: Array<number>
  public readonly MIN_SCREEN_WIDTH_PX = 320
  public readonly MAX_SCREEN_WIDTH_PX = 3840

  constructor(@Inject(IMAGE_CONFIG) imageConfig: ImageConfig) {
    this.ALL_BREAKPOINTS = [
      ...(imageConfig.breakpoints ?? []),
      ...this.CUSTOM_BREAKPOINTS,
    ].sort((a, b) => a - b)
  }

  public range(from = -Infinity, to = Infinity): ImageResponsiveBreakpoints {
    return new ImageResponsiveBreakpoints(
      this.ALL_BREAKPOINTS.filter(
        (breakpoint) => breakpoint >= from && breakpoint <= to,
      ),
    )
  }
}
