import { ComponentFixture, TestBed } from '@angular/core/testing'

import { TechMaterialComponent } from './tech-material.component'
import { MockComponents, MockProvider } from 'ng-mocks'
import { ImageSwiperComponent } from '../../image-swiper/image-swiper.component'
import { ProjectImagesService } from '../project-images.service'

describe('TechMaterialComponent', () => {
  let component: TechMaterialComponent
  let fixture: ComponentFixture<TechMaterialComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        TechMaterialComponent,
        MockComponents(ImageSwiperComponent),
      ],
      providers: [
        MockProvider(ProjectImagesService, {
          async bySlugAndFilename() {
            return []
          },
        }),
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
