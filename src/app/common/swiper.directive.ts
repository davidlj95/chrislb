import {
  AfterViewInit,
  Directive,
  ElementRef,
  Inject,
  Input,
  PLATFORM_ID,
} from '@angular/core'
import { SwiperOptions } from 'swiper/types'
import { SwiperContainer } from 'swiper/swiper-element'
import { isPlatformBrowser } from '@angular/common'

@Directive({
  selector: '[appSwiper]',
})
export class SwiperDirective implements AfterViewInit {
  @Input('appSwiper')
  options?: SwiperOptions

  public container: SwiperContainer

  constructor(
    private el: ElementRef<HTMLElement>,
    @Inject(PLATFORM_ID) private platformId: object,
  ) {
    this.container = this.el.nativeElement as SwiperContainer
  }

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) {
      return
    }

    if (typeof this.container.initialize === 'function') {
      Object.assign(this.container, this.options)
      this.container.initialize()
    } else {
      throw new NoInitializeMethodError()
    }
  }
}

export class NoInitializeMethodError extends Error {}