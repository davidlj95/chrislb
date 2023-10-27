import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ProjectItemComponent } from './project-item.component'
import { MockComponents } from 'ng-mocks'
import { ImageSwiperComponent } from '../../image-swiper/image-swiper.component'

describe('ProjectItemComponent', () => {
  let component: ProjectItemComponent
  let fixture: ComponentFixture<ProjectItemComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        ProjectItemComponent,
        MockComponents(ImageSwiperComponent),
      ],
    })
    fixture = TestBed.createComponent(ProjectItemComponent)
    component = fixture.componentInstance
    // TODO: proper tests
    //fixture.detectChanges();
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
