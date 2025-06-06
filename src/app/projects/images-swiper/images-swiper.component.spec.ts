import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ImagesSwiperComponent } from './images-swiper.component'
import { testbedSetup } from '../../../test/testbed-setup'

describe('ImagesSwiperComponent', () => {
  let component: ImagesSwiperComponent
  let fixture: ComponentFixture<ImagesSwiperComponent>

  beforeEach(() => {
    testbedSetup()
    fixture = TestBed.createComponent(ImagesSwiperComponent)
    fixture.componentRef.setInput('images', [])
    fixture.componentRef.setInput('sizes', '')
    fixture.componentRef.setInput('slidesPerView', 2)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
