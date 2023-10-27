import { ComponentFixture, TestBed } from '@angular/core/testing'

import { TechMaterialComponent } from './tech-material.component'
import { MockComponents } from 'ng-mocks'
import { ImageSwiperComponent } from '../../image-swiper/image-swiper.component'

describe('TechMaterialComponent', () => {
  let component: TechMaterialComponent
  let fixture: ComponentFixture<TechMaterialComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        TechMaterialComponent,
        MockComponents(ImageSwiperComponent),
      ],
    })
    fixture = TestBed.createComponent(TechMaterialComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
