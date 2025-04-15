import { Component } from '@angular/core'
import { SwiperOptions } from 'swiper/types'
import { TestBed } from '@angular/core/testing'
import { SWIPER_JS, SwiperDirective } from './swiper.directive'
import { testbedSetup } from '../../../test/testbed-setup'
import Swiper from 'swiper'

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

  it('should initialize Swiper.js on init', () => {
    const constructorSpy = jasmine.createSpy()
    const [fixture] = setupHostComponent({
      options,
      SwiperJs: makeSwiperJs({ constructorSpy }),
    })
    fixture.detectChanges()

    expect(constructorSpy).toHaveBeenCalledOnceWith(
      fixture.debugElement.children[0].nativeElement,
      options,
    )
  })

  it('should destroy Swiper.js on component destroy', () => {
    const destroySpy = jasmine.createSpy()
    const [fixture] = setupHostComponent({
      options,
      SwiperJs: makeSwiperJs({ destroySpy }),
    })
    fixture.detectChanges()

    expect(destroySpy).not.toHaveBeenCalled()

    fixture.componentRef.destroy()

    expect(destroySpy).toHaveBeenCalledOnceWith()
  })
})

function setupHostComponent({
  options,
  SwiperJs,
}: {
  options?: SwiperOptions
  SwiperJs?: Partial<typeof Swiper>
} = {}) {
  testbedSetup({
    providers: [SwiperJs ? { provide: SWIPER_JS, useValue: SwiperJs } : []],
  })

  @Component({
    template: ` <div [appSwiper]="options"></div>`,
    imports: [SwiperDirective],
  })
  class HostComponent {
    readonly options = options ?? {}
  }

  const fixture = TestBed.createComponent(HostComponent)
  return [fixture, fixture.componentInstance] as const
}

const makeSwiperJs = ({
  constructorSpy,
  destroySpy,
}: {
  constructorSpy?: jasmine.Spy
  destroySpy?: jasmine.Spy
} = {}) => {
  class swiperJs implements Pick<Swiper, 'destroy'> {
    constructor(...args: unknown[]) {
      ;(constructorSpy ?? jasmine.createSpy('Swiper.constructor'))(...args)
    }

    // noinspection JSUnusedGlobalSymbols
    destroy = destroySpy ?? jasmine.createSpy('Swiper.destroy')
  }

  return swiperJs as unknown as typeof Swiper
}
