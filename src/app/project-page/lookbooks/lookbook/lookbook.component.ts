import { Component, Input } from '@angular/core'
import { SwiperOptions } from 'swiper/types'
import { DEFAULT_IMAGE_ALT } from '../../../common/default-image-alt'
import { Lookbook } from './lookbook'

@Component({
  selector: 'app-lookbook',
  templateUrl: './lookbook.component.html',
  styleUrls: ['./lookbook.component.scss'],
})
export class LookbookComponent {
  public swiperOptions!: SwiperOptions
  @Input() public index?: number
  @Input() public priority?: boolean
  protected readonly MAX_SLIDES_PER_VIEW = 3
  protected readonly DEFAULT_IMAGE_ALT = DEFAULT_IMAGE_ALT

  protected _lookbook!: Lookbook

  @Input({ required: true })
  public set lookbook(lookbook: Lookbook) {
    this._lookbook = lookbook
    this.swiperOptions = this.getSwiperOptions(this._lookbook.images.length)
  }

  public get lookbook(): Lookbook {
    return this._lookbook
  }

  private getSwiperOptions(slidesCount: number): SwiperOptions {
    const loop = slidesCount > this.MAX_SLIDES_PER_VIEW * 2
    return {
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
      loop,
      rewind: !loop,
      autoplay: {
        disableOnInteraction: true,
        delay: 2500,
      },
      slidesPerView: 2,
      breakpoints: {
        959.98: {
          slidesPerView: this.MAX_SLIDES_PER_VIEW,
        },
      },
    }
  }
}
