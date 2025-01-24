import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ImagesSwiperGlidejsComponent } from './images-swiper-glidejs.component'

describe('ImagesSwiperGlidejsComponent', () => {
  let component: ImagesSwiperGlidejsComponent
  let fixture: ComponentFixture<ImagesSwiperGlidejsComponent>

  beforeEach(async () => {
    fixture = TestBed.createComponent(ImagesSwiperGlidejsComponent)
    fixture.componentRef.setInput('images', [])
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
