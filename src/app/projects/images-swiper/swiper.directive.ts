import { Directive, effect, ElementRef, input, NgZone } from '@angular/core'
import { SwiperOptions } from 'swiper/types'
import { type SwiperContainer } from 'swiper/swiper-element'

@Directive({
  selector: '[appSwiper]',
  standalone: true,
})
export class SwiperDirective {
  readonly options = input.required<SwiperOptions>({ alias: 'appSwiper' })

  constructor(
    elRef: ElementRef<Element & Partial<SwiperContainer>>,
    _ngZone: NgZone,
  ) {
    effect(() => {
      const element = elRef.nativeElement
      const initializer = element.initialize
      if (initializer) {
        Object.assign(element, this.options())
        _ngZone.runOutsideAngular(initializer.bind(element))
      }
    })
  }
}
