import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  Input,
  OnChanges,
} from '@angular/core'
import { register as registerSwiper } from 'swiper/element'

import { DEFAULT_ALT } from '../../common/images/default-alt'
import { SwiperOptions } from 'swiper/types'
import {
  A11y,
  Autoplay,
  Keyboard,
  Navigation,
  Pagination,
} from 'swiper/modules'
import { ResponsiveImageAttributes } from '../../common/images/responsive-image-attributes'
import { ImageAsset } from '../../common/images/image-asset'
import { isEmpty, isNumber } from 'lodash-es'
import { SwiperDirective } from './swiper.directive'
import { NgFor, NgIf, NgOptimizedImage } from '@angular/common'

// There's no fancier way to install Web Components in Angular :P
// https://stackoverflow.com/a/75353889/3263250
registerSwiper()

@Component({
  selector: 'app-images-swiper',
  templateUrl: './images-swiper.component.html',
  styleUrls: ['./images-swiper.component.scss'],
  standalone: true,
  imports: [NgIf, SwiperDirective, NgFor, NgOptimizedImage],
  // Use swiper web components
  // A better approach would be to declare those but there's no easy way
  // https://stackoverflow.com/a/43012920/3263250
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ImagesSwiperComponent implements OnChanges {
  @Input({ required: true }) public images!: readonly ImageAsset[]
  @Input({ required: true })
  public responsiveImageAttributes!: ResponsiveImageAttributes
  @Input() public priority?: boolean
  @Input() public customSwiperOptions?: SwiperOptions
  protected readonly DEFAULT_IMAGE_ALT = DEFAULT_ALT
  protected readonly DEFAULT_SWIPER_OPTIONS: SwiperOptions = {
    modules: [A11y, Autoplay, Keyboard, Navigation, Pagination],
    injectStylesUrls: ['/swiper.css'],
    a11y: {
      enabled: false,
    },
    autoplay: {
      disableOnInteraction: true,
      delay: 2500,
    },
    keyboard: {
      enabled: true,
    },
    navigation: {
      enabled: true,
    },
    pagination: {
      enabled: true,
      clickable: true,
      dynamicBullets: true,
    },
  }
  protected _maxSlidesPerView: number | null = null
  protected _swiperOptions: SwiperOptions = this.DEFAULT_SWIPER_OPTIONS

  ngOnChanges(): void {
    const swiperOptions: SwiperOptions = {
      ...this.DEFAULT_SWIPER_OPTIONS,
      ...this.customSwiperOptions,
    }
    this._maxSlidesPerView = this.getMaxSlidesPerView(swiperOptions)
    this._swiperOptions = this.updateSwiperOptionsWithLoopOrRewind(
      swiperOptions,
      this._maxSlidesPerView,
    )
  }

  public getMaxSlidesPerView(swiperOptions: SwiperOptions): number | null {
    const breakpointSlidesPerViews = swiperOptions.breakpoints
      ? Object.values(swiperOptions.breakpoints).map(
          (options) => options.slidesPerView,
        )
      : []
    const defaultSlidesPerView = swiperOptions.slidesPerView
    const allSlidesPerView = breakpointSlidesPerViews
      .concat([defaultSlidesPerView])
      .filter(isNumber)
    if (isEmpty(allSlidesPerView)) {
      return null
    }
    return Math.max(...allSlidesPerView)
  }

  private updateSwiperOptionsWithLoopOrRewind(
    swiperOptions: SwiperOptions,
    maxSlidesPerView: number | null,
  ): SwiperOptions {
    if (!isEmpty(swiperOptions.loop) || !isEmpty(swiperOptions.rewind)) {
      return swiperOptions
    }
    const loop =
      !isEmpty(this.images) &&
      maxSlidesPerView !== null &&
      this.images.length > maxSlidesPerView * 2
    return {
      ...swiperOptions,
      loop,
      rewind: !loop,
    }
  }
}
