import {
  AfterViewInit,
  Directive,
  ElementRef,
  inject,
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
  private readonly _swiperJs = inject(SWIPER_JS)
  private readonly _elRef = inject<ElementRef<HTMLElement>>(ElementRef)

  readonly options = input.required<SwiperOptions>({ alias: 'appSwiper' })
  instance?: Swiper

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
