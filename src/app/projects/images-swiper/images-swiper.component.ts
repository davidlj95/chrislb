import { Component, Input, OnChanges } from '@angular/core'
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

// There's no fancier way to install Web Components in Angular :P
// https://stackoverflow.com/a/75353889/3263250
registerSwiper()

@Component({
  selector: 'app-images-swiper',
  templateUrl: './images-swiper.component.html',
  styleUrls: ['./images-swiper.component.scss'],
})
export class ImagesSwiperComponent implements OnChanges {
  @Input({ required: true }) public images!: ReadonlyArray<ImageAsset>
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
      .filter(
        (slidesPerView): slidesPerView is number =>
          slidesPerView !== undefined && slidesPerView !== 'auto',
      )
    if (allSlidesPerView.length === 0) {
      return null
    }
    return Math.max(...allSlidesPerView)
  }

  private updateSwiperOptionsWithLoopOrRewind(
    swiperOptions: SwiperOptions,
    maxSlidesPerView: number | null,
  ): SwiperOptions {
    if (
      swiperOptions.loop !== undefined ||
      swiperOptions.rewind !== undefined
    ) {
      return swiperOptions
    }
    const loop =
      !!this.images &&
      maxSlidesPerView !== null &&
      this.images.length > maxSlidesPerView * 2
    return {
      ...swiperOptions,
      loop,
      rewind: !loop,
    }
  }
}
