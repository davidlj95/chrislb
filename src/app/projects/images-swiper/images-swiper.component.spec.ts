import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ImagesSwiperComponent } from './images-swiper.component'
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('ImagesSwiperComponent', () => {
  let component: ImagesSwiperComponent
  let fixture: ComponentFixture<ImagesSwiperComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ImagesSwiperComponent],
      //👇 To use swiper-[container|slide] HTML element
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    fixture = TestBed.createComponent(ImagesSwiperComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
