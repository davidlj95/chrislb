import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ImagesSwiperComponent } from './images-swiper.component'

describe('ImagesSwiperComponent', () => {
  let component: ImagesSwiperComponent
  let fixture: ComponentFixture<ImagesSwiperComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({})
    fixture = TestBed.createComponent(ImagesSwiperComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
