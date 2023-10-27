import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ImageSwiperComponent } from './image-swiper.component'
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('ImageSwiperComponent', () => {
  let component: ImageSwiperComponent
  let fixture: ComponentFixture<ImageSwiperComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ImageSwiperComponent],
      //👇 To use swiper-[container|slide] HTML element
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    fixture = TestBed.createComponent(ImageSwiperComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
