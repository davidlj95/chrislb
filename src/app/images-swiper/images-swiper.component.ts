import { Component, Input, OnChanges } from '@angular/core'
import { DEFAULT_IMAGE_ALT } from '../common/default-image-alt'
import { SwiperOptions } from 'swiper/types'
import { ImageAsset } from '../common/images/types'

@Component({
  selector: 'app-images-swiper',
  templateUrl: './images-swiper.component.html',
  styleUrls: ['./images-swiper.component.scss'],
})
export class ImagesSwiperComponent implements OnChanges {
  @Input({ required: true }) public images!: ReadonlyArray<ImageAsset> | null
  @Input({ required: true }) public srcSet!: string
  @Input({ required: true }) public sizes!: string
  @Input() public priority?: boolean
  @Input() public customSwiperOptions?: SwiperOptions
  protected readonly DEFAULT_IMAGE_ALT = DEFAULT_IMAGE_ALT
  protected readonly DEFAULT_SWIPER_OPTIONS: SwiperOptions = {
    pagination: {
      enabled: true,
      clickable: true,
      dynamicBullets: true,
    },
    navigation: {
      enabled: true,
    },
    keyboard: {
      enabled: true,
    },
    autoplay: {
      disableOnInteraction: true,
      delay: 2500,
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
