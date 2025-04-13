import {
  register as registerSwiper,
  type SwiperContainer,
} from 'swiper/element'
import { Directive, effect, ElementRef, input, NgZone } from '@angular/core'
import { SwiperOptions } from 'swiper/types'

// There's no fancier way to install Web Components in Angular :P
// https://stackoverflow.com/a/75353889/3263250
registerSwiper()

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
