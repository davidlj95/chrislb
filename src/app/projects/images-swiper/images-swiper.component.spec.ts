import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ImagesSwiperComponent } from './images-swiper.component'

describe('ImagesSwiperComponent', () => {
  let component: ImagesSwiperComponent
  let fixture: ComponentFixture<ImagesSwiperComponent>

  beforeEach(() => {
    fixture = TestBed.createComponent(ImagesSwiperComponent)
    fixture.componentRef.setInput('images', [])
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
