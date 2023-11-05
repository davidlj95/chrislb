import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  DebugElement,
  ElementRef,
  OnInit,
  PLATFORM_ID,
  Type,
} from '@angular/core'
import { SwiperOptions } from 'swiper/types'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { NoInitializeMethodError, SwiperDirective } from './swiper.directive'
import { By } from '@angular/platform-browser'
import {
  PLATFORM_BROWSER_ID,
  PLATFORM_SERVER_ID,
  PlatformId,
} from '../../../test/platform-ids'
import { MockProvider } from 'ng-mocks'

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

  describe('when not rendering on browser', () => {
    const platformId = PLATFORM_SERVER_ID

    it('should do nothing', () => {
      const initialize = jasmine.createSpy('initialize')
      const componentClass = makeComponentWithDirective({
        options,
        initialize,
      })
      const [fixture] = makeSut({ componentClass, platformId })

      fixture.detectChanges()

      expect(initialize).not.toHaveBeenCalledOnceWith()
      expect(getSwiperElement(fixture)).not.toContain(
        jasmine.objectContaining(options),
      )
    })
  })
  describe('when rendering on browser', () => {
    const platformId = PLATFORM_BROWSER_ID
    describe('when initialize is not a method', () => {
      it('should not call it and throw error', () => {
        const componentClass = makeComponentWithDirective({
          options,
          initialize: 0 as unknown as () => void,
        })
        const [fixture] = makeSut({ componentClass, platformId })

        expect(() => fixture.detectChanges()).toThrowError(
          NoInitializeMethodError,
        )
        expect(getSwiperElement(fixture).nativeElement).not.toEqual(
          jasmine.objectContaining(options),
        )
      })
    })
    describe('when initialize method exists', () => {
      it('should call it when all options are set', () => {
        let swiperElement: DebugElement | undefined
        const initialize = jasmine
          .createSpy('initialize', () => {
            swiperElement = getSwiperElement(fixture)
          })
          .and.callThrough()
        const componentClass = makeComponentWithDirective({
          options,
          initialize,
        })
        const [fixture] = makeSut({ componentClass, platformId })

        fixture.detectChanges()

        expect(initialize).toHaveBeenCalledOnceWith()
        expect(swiperElement?.nativeElement).toEqual(
          jasmine.objectContaining(options),
        )
      })
    })
  })
})

const SWIPER_ELEMENT_TAG = 'swiper-container'

function makeComponentWithDirective({
  options,
  initialize,
}: {
  options?: SwiperOptions
  initialize?: () => void
}): Type<unknown> {
  const noOp = () => {
    return
  }

  @Component({
    template: ` <!--suppress AngularUndefinedBinding -->
    <${SWIPER_ELEMENT_TAG} [appSwiper]="options"></${SWIPER_ELEMENT_TAG}>`,
  })
  class SwiperComponent implements OnInit {
    public readonly options = options

    constructor(private el: ElementRef) {}

    ngOnInit() {
      this.el.nativeElement.children[0].initialize = initialize ?? noOp
    }
  }

  return SwiperComponent
}

function makeSut<T>({
  componentClass,
  platformId,
}: {
  componentClass: Type<T>
  platformId: PlatformId
}): [ComponentFixture<T>, T] {
  TestBed.configureTestingModule({
    declarations: [componentClass, SwiperDirective],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    providers: [MockProvider(PLATFORM_ID, platformId)],
  })
  const fixture = TestBed.createComponent(componentClass)
  return [fixture, fixture.componentInstance]
}

function getSwiperElement(fixture: ComponentFixture<unknown>): DebugElement {
  return fixture.debugElement.query(By.css(SWIPER_ELEMENT_TAG))
}
