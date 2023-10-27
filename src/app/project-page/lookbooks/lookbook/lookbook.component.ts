import { Component, Input } from '@angular/core'
import { SwiperOptions } from 'swiper/types'
import { Lookbook } from './lookbook'
import { ImageResponsiveBreakpointsService } from '../../../common/image-responsive-breakpoints.service'
import { ImageResponsiveBreakpoints } from '../../../common/image-responsive-breakpoints'

@Component({
  selector: 'app-lookbook',
  templateUrl: './lookbook.component.html',
  styleUrls: ['./lookbook.component.scss'],
})
export class LookbookComponent {
  @Input() public index?: number
  @Input() public priority?: boolean
  @Input({ required: true }) public lookbook!: Lookbook
  public readonly MAX_WIDTH_PX = 850
  public readonly SLIDES_PER_VIEW = 2
  public readonly MAX_SLIDE_WIDTH_PX = this.MAX_WIDTH_PX / this.SLIDES_PER_VIEW
  public readonly srcSet = new ImageResponsiveBreakpoints(
    this.imageResponsiveBreakpointsService
      .range(
        this.imageResponsiveBreakpointsService.MIN_SCREEN_WIDTH_PX / 2,
        this.MAX_SLIDE_WIDTH_PX,
      )
      .pxValues.concat([this.MAX_SLIDE_WIDTH_PX]),
  ).toSrcSet()
  public readonly CUSTOM_SWIPER_OPTIONS: SwiperOptions = {
    slidesPerView: this.SLIDES_PER_VIEW,
  }

  constructor(
    private imageResponsiveBreakpointsService: ImageResponsiveBreakpointsService,
  ) {}
}
