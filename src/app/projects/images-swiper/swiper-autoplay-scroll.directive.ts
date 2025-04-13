import {
  Directive,
  ElementRef,
  inject,
  InjectionToken,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
} from '@angular/core'
import { SwiperContainer } from 'swiper/swiper-element'
import { LOGO_HEIGHT_PX } from '@/app/logo/logo'
import { isPlatformBrowser } from '@angular/common'

@Directive({
  selector: '[appSwiperAutoplayScroll]',
  standalone: true,
})
export class SwiperAutoplayScrollDirective implements OnInit, OnDestroy {
  private readonly _observer = inject(SWIPER_AUTOPLAY_INTERSECTION_OBSERVER)
  private readonly _elRef = inject(ElementRef)

  ngOnInit() {
    this._observer?.observe(this._elRef.nativeElement)
  }

  ngOnDestroy() {
    this._observer?.unobserve(this._elRef.nativeElement)
  }
}

export const SWIPER_AUTOPLAY_INTERSECTION_OBSERVER =
  new InjectionToken<IntersectionObserver | null>('', {
    factory: () =>
      isPlatformBrowser(inject(PLATFORM_ID))
        ? createIntersectionObserver()
        : null,
  })

const createIntersectionObserver = () =>
  new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const { isIntersecting, target } = entry
        const swiperInstance = (target as Partial<SwiperContainer>).swiper
        if (!swiperInstance) {
          return
        }
        if (!isIntersecting) {
          swiperInstance.autoplay.stop()
          return
        }
        swiperInstance.autoplay.start()
      })
    },
    { rootMargin: `${-LOGO_HEIGHT_PX}px 0px 0px 0px`, threshold: 0.5 },
  )
