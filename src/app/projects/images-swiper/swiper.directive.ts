import {
  AfterViewInit,
  Directive,
  ElementRef,
  Inject,
  Input,
  NgZone,
  PLATFORM_ID,
} from '@angular/core'
import { SwiperOptions } from 'swiper/types'
import { SwiperContainer } from 'swiper/swiper-element'
import { isPlatformBrowser } from '@angular/common'

@Directive({
  selector: '[appSwiper]',
  standalone: true,
})
export class SwiperDirective implements AfterViewInit {
  @Input('appSwiper')
  options?: SwiperOptions

  public readonly container: SwiperContainer

  constructor(
    private el: ElementRef<HTMLElement>,
    @Inject(PLATFORM_ID) private platformId: object,
    private readonly ngZone: NgZone,
  ) {
    this.container = this.el.nativeElement as SwiperContainer
  }

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) {
      return
    }

    if (typeof this.container.initialize === 'function') {
      Object.assign(this.container, this.options)
      this.ngZone.runOutsideAngular(() => this.container.initialize())
    } else {
      throw new NoInitializeMethodError()
    }
  }
}

export class NoInitializeMethodError extends Error {}
