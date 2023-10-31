import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ProjectPageComponent } from './project-page.component'
import { MockComponents, MockProvider } from 'ng-mocks'
import { ProjectsService } from '../projects-page/projects.service'
import { Project } from '../projects-page/project-item/project-item'
import { ImagesSwiperComponent } from '../images-swiper/images-swiper.component'
import { ProjectLookbooksService } from './project-lookbooks.service'
import { ProjectImagesService } from './project-images.service'
import { of } from 'rxjs'

describe('ProjectPageComponent', () => {
  let component: ProjectPageComponent
  let fixture: ComponentFixture<ProjectPageComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        ProjectPageComponent,
        MockComponents(ImagesSwiperComponent),
      ],
      providers: [
        MockProvider(ProjectsService, {
          async bySlug(): Promise<Project> {
            return { title: 'Title', description: 'Description' } as Project
          },
        }),
        MockProvider(ProjectLookbooksService, {
          bySlug() {
            return of([])
          },
        }),
        MockProvider(ProjectImagesService, {
          bySlugAndFilename() {
            return of([])
          },
        }),
      ],
    })
    fixture = TestBed.createComponent(ProjectPageComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
