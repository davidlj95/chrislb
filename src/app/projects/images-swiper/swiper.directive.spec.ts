import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  DebugElement,
  ElementRef,
  OnInit,
  Type,
} from '@angular/core'
import { SwiperOptions } from 'swiper/types'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { SwiperDirective } from './swiper.directive'
import { By } from '@angular/platform-browser'
import { SwiperContainer } from 'swiper/swiper-element'
import { testbedSetup } from '../../../test/testbed-setup'

describe('SwiperDirective', () => {
  const options: SwiperOptions = {
    breakpoints: {
      640: {
        slidesPerView: 2,
        spaceBetween: 20,
      },
      768: {
        slidesPerView: 4,
        spaceBetween: 40,
      },
    },
  }

  it('should not call initializer method if does not exist', () => {
    const component = makeComponentWithDirective({
      options,
      initialize: undefined,
    })
    const [fixture] = makeSut({ component })
    fixture.detectChanges()

    expect(getSwiperElement(fixture).nativeElement).not.toEqual(
      jasmine.objectContaining(options),
    )
  })

  it('should call initializer method to set all swiper options', () => {
    const initialize = jasmine
      .createSpy<SwiperContainer['initialize']>('initializer')
      .and.callThrough()
    const component = makeComponentWithDirective({
      options,
      initialize,
    })
    const [fixture] = makeSut({ component })
    fixture.detectChanges()

    expect(initialize).toHaveBeenCalledOnceWith()
    expect(getSwiperElement(fixture)?.nativeElement).toEqual(
      jasmine.objectContaining(options),
    )
  })
})

const SWIPER_ELEMENT_TAG = 'swiper-container'

function makeComponentWithDirective({
  options,
  initialize,
}: {
  options: SwiperOptions
  initialize: (() => void) | undefined
}): Type<unknown> {
  @Component({
    template: `
      <${SWIPER_ELEMENT_TAG} [appSwiper]="options"></${SWIPER_ELEMENT_TAG}>`,
    imports: [SwiperDirective],
  })
  class SwiperComponent implements OnInit {
    readonly options = options

    constructor(private readonly _el: ElementRef) {}

    ngOnInit() {
      this._el.nativeElement.children[0].initialize = initialize
    }
  }

  return SwiperComponent
}

function makeSut<T>({
  component,
}: {
  component: Type<T>
}): [ComponentFixture<T>, T] {
  testbedSetup({
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  })
  const fixture = TestBed.createComponent(component)
  return [fixture, fixture.componentInstance]
}

function getSwiperElement(fixture: ComponentFixture<unknown>): DebugElement {
  return fixture.debugElement.query(By.css(SWIPER_ELEMENT_TAG))
}
