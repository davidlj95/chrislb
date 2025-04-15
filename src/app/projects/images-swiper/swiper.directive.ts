import {
  Directive,
  effect,
  ElementRef,
  Inject,
  input,
  OnDestroy,
  PLATFORM_ID,
} from '@angular/core'
import { SwiperOptions } from 'swiper/types'
import Swiper from 'swiper'
import { isPlatformBrowser } from '@angular/common'

@Directive({ selector: '[appSwiper]' })
export class SwiperDirective implements OnDestroy {
  readonly options = input.required<SwiperOptions>({ alias: 'appSwiper' })
  instance?: Swiper

  constructor(
    elRef: ElementRef<HTMLElement>,
    @Inject(PLATFORM_ID) platformId: object,
  ) {
    effect(() => {
      if (!this.instance && isPlatformBrowser(platformId)) {
        this.instance = new Swiper(elRef.nativeElement, this.options())
      }
    })
  }

  ngOnDestroy() {
    this.instance?.destroy()
  }
}
