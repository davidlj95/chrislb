import { ComponentFixture, TestBed } from '@angular/core/testing'

import { DesignBookComponent } from './design-book.component'
import { MockComponents, MockProvider } from 'ng-mocks'
import { ImageSwiperComponent } from '../../image-swiper/image-swiper.component'
import { ProjectImagesService } from '../project-images.service'
import { of } from 'rxjs'

describe('DesignBookComponent', () => {
  let component: DesignBookComponent
  let fixture: ComponentFixture<DesignBookComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DesignBookComponent, MockComponents(ImageSwiperComponent)],
      providers: [
        MockProvider(ProjectImagesService, {
          bySlugAndFilename() {
            return of()
          },
        }),
      ],
    })
    fixture = TestBed.createComponent(DesignBookComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
