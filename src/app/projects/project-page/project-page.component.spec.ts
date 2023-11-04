import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ProjectPageComponent } from './project-page.component'
import { MockComponents, MockProvider } from 'ng-mocks'
import { ProjectsService } from '../projects.service'
import { Project } from '../project-list-item'
import { ImagesSwiperComponent } from '../../images-swiper/images-swiper.component'
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
          bySlug() {
            return of({
              title: 'Title',
              description: 'Description',
              youtubePlaylistId: 'Playlist ID',
            } as Project)
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
    component.slug = 'foo'
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
