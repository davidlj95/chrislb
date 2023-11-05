import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ProjectPageComponent } from './project-page.component'
import { MockComponents, MockProvider } from 'ng-mocks'
import { ProjectsService } from '../projects.service'
import { ImagesSwiperComponent } from '../images-swiper/images-swiper.component'
import { of } from 'rxjs'
import { Project } from '../project'
import { ProjectAssetsCollectionsService } from './project-assets-collections.service'

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
        MockProvider(ProjectAssetsCollectionsService, {
          byProject() {
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
