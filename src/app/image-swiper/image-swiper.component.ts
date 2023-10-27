import { Component, Input } from '@angular/core'
import { DEFAULT_IMAGE_ALT } from '../common/default-image-alt'
import { SwiperOptions } from 'swiper/types'
import { ImageAsset } from '../../data/images/types'

@Component({
  selector: 'app-image-swiper',
  templateUrl: './image-swiper.component.html',
  styleUrls: ['./image-swiper.component.scss'],
})
export class ImageSwiperComponent {
  protected _images!: ReadonlyArray<ImageAsset> | null

  @Input({ required: true })
  public set images(images: ReadonlyArray<ImageAsset> | null) {
    this._images = images
    this.updateSwiperOptionsWithLoopOrRewind()
  }

  @Input({ required: true }) public srcSet!: string
  @Input({ required: true }) public sizes!: string
  @Input() public priority?: boolean
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

  protected _swiperOptions: SwiperOptions = this.DEFAULT_SWIPER_OPTIONS
  protected _customSwiperOptions: SwiperOptions = {}

  @Input()
  public set swiperOptions(swiperOptions: SwiperOptions) {
    this._customSwiperOptions = swiperOptions
    this.updateSwiperOptionsWithLoopOrRewind()
  }

  public get maxSlidesPerView(): number | null {
    const breakpointSlidesPerViews = this._swiperOptions.breakpoints
      ? Object.values(this._swiperOptions.breakpoints).map(
          (options) => options.slidesPerView,
        )
      : []
    const defaultSlidesPerView = this._swiperOptions.slidesPerView
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

  private updateSwiperOptionsWithLoopOrRewind() {
    const maxSlidesPerView = this.maxSlidesPerView
    const loop =
      !!this._images &&
      maxSlidesPerView !== null &&
      this._images.length > maxSlidesPerView * 2
    this._swiperOptions = {
      ...this.DEFAULT_SWIPER_OPTIONS,
      loop,
      rewind: !loop,
      ...this._customSwiperOptions,
    }
  }
}
