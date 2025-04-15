import {
  AfterViewInit,
  Directive,
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
export class SwiperDirective implements AfterViewInit, OnDestroy {
  readonly options = input.required<SwiperOptions>({ alias: 'appSwiper' })
  instance?: Swiper

  constructor(
    @Inject(SWIPER_JS) private readonly _swiperJs: typeof Swiper,
    private readonly _elRef: ElementRef<HTMLElement>,
  ) {}

  ngAfterViewInit(): void {
    if (this._swiperJs && !this.instance) {
      this.instance = new this._swiperJs(
        this._elRef.nativeElement,
        this.options(),
      )
    }
  }

  ngOnDestroy() {
    this.instance?.destroy()
  }
}

// @visibleForTesting
export const SWIPER_JS = new InjectionToken<typeof Swiper | null>('Swiper.js', {
  factory: () => (isPlatformBrowser(inject(PLATFORM_ID)) ? Swiper : null),
})
