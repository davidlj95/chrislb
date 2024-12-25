import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ProjectPageComponent } from './project-page.component'
import { MockComponents, MockProvider } from 'ng-mocks'
import { ImagesSwiperComponent } from '../images-swiper/images-swiper.component'
import { of } from 'rxjs'
import { ProjectAssetsCollectionsService } from './project-assets-collections.service'
import { ActivatedRoute } from '@angular/router'
import { ProjectRouteData } from './projects-routes-data'
import { NgxMetaService } from '@davidlj95/ngx-meta/core'

describe('ProjectPageComponent', () => {
  let component: ProjectPageComponent
  let fixture: ComponentFixture<ProjectPageComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MockProvider(ActivatedRoute, {
          data: of({
            project: {
              title: 'Title',
              description: 'Description',
              youtubePlaylistId: 'Playlist ID',
            },
          } as ProjectRouteData),
        }),
        MockProvider(NgxMetaService),
      ],
    })
    TestBed.overrideComponent(ProjectPageComponent, {
      set: {
        imports: [MockComponents(ImagesSwiperComponent)],
        providers: [
          MockProvider(ProjectAssetsCollectionsService, {
            byProject() {
              return of([])
            },
          }),
        ],
      },
    })
    fixture = TestBed.createComponent(ProjectPageComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
