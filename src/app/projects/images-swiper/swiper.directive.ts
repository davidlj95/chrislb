import {
  Directive,
  effect,
  ElementRef,
  inject,
  Inject,
  InjectionToken,
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
    @Inject(SWIPER_JS) swiperJs: typeof Swiper,
    elRef: ElementRef<HTMLElement>,
  ) {
    effect(() => {
      if (swiperJs && !this.instance) {
        this.instance = new swiperJs(elRef.nativeElement, this.options())
      }
    })
  }

  ngOnDestroy() {
    this.instance?.destroy()
  }
}

// @visibleForTesting
export const SWIPER_JS = new InjectionToken<typeof Swiper | null>('Swiper.js', {
  factory: () => (isPlatformBrowser(inject(PLATFORM_ID)) ? Swiper : null),
})
