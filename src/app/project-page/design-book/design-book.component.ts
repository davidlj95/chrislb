import { Component, Input } from '@angular/core'
import { Observable } from 'rxjs'
import { ImageAsset } from '../../../data/images/types'
import { SwiperOptions } from 'swiper/types'
import { ImageResponsiveBreakpointsService } from '../../common/image-responsive-breakpoints.service'
import { ProjectDesignBookService } from './project-design-book.service'

@Component({
  selector: 'app-design-book',
  templateUrl: './design-book.component.html',
  styleUrls: ['./design-book.component.scss'],
})
export class DesignBookComponent {
  @Input({ required: true }) set slug(slug: string) {
    this.images = this.projectDesignBookService.bySlug(slug)
  }

  public images!: Observable<ReadonlyArray<ImageAsset>>
  public readonly srcSet = this.imageResponsiveBreakpointsService
    .range(
      this.imageResponsiveBreakpointsService.MIN_SCREEN_WIDTH_PX,
      this.imageResponsiveBreakpointsService.MAX_SCREEN_WIDTH_PX / 2,
    )
    .toSrcSet()
  public readonly CUSTOM_SWIPER_OPTIONS: SwiperOptions = {
    slidesPerView: 1,
    breakpoints: {
      959.98: {
        slidesPerView: 2,
      },
    },
  }

  constructor(
    private projectDesignBookService: ProjectDesignBookService,
    private imageResponsiveBreakpointsService: ImageResponsiveBreakpointsService,
  ) {}
}
