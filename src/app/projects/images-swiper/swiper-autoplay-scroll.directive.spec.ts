import {
  SWIPER_AUTOPLAY_INTERSECTION_OBSERVER,
  SwiperAutoplayScrollDirective,
} from './swiper-autoplay-scroll.directive'
import { Component } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { testbedSetup } from '../../../test/testbed-setup'

describe('SwiperAutoplayScrollDirective', () => {
  it('should create an instance', () => {
    const fixture = setupHostComponent()
    const directive = fixture.componentRef.injector.get(
      SwiperAutoplayScrollDirective,
    )
    expect(directive).toBeTruthy()
  })

  it('should observe on init', () => {
    const intersectionObserver = makeIntersectionObserverSpy()
    const fixture = setupHostComponent({ intersectionObserver })
    fixture.detectChanges()

    expect(intersectionObserver.observe).toHaveBeenCalledOnceWith(
      fixture.debugElement.nativeElement,
    )
  })

  it('should unobserve on destroy', () => {
    const intersectionObserver = makeIntersectionObserverSpy()
    const fixture = setupHostComponent({ intersectionObserver })

    fixture.destroy()

    expect(intersectionObserver.unobserve).toHaveBeenCalledOnceWith(
      fixture.debugElement.nativeElement,
    )
  })
})

const setupHostComponent = (
  opts: { intersectionObserver?: IntersectionObserver } = {},
) => {
  testbedSetup({
    providers: [
      opts.intersectionObserver
        ? {
            provide: SWIPER_AUTOPLAY_INTERSECTION_OBSERVER,
            useValue: opts.intersectionObserver,
          }
        : [],
    ],
  })

  @Component({
    template: ``,
    hostDirectives: [SwiperAutoplayScrollDirective],
  })
  class HostComponent {}

  return TestBed.createComponent(HostComponent)
}

const makeIntersectionObserverSpy = () =>
  jasmine.createSpyObj<IntersectionObserver>('io', ['observe', 'unobserve'])
