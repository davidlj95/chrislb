import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ProjectDetailPageComponent } from './project-detail-page.component'
import { MockComponents, MockProvider } from 'ng-mocks'
import { ImagesSwiperComponent } from '../images-swiper/images-swiper.component'
import { of } from 'rxjs'
import { ActivatedRoute } from '@angular/router'
import { ProjectDetailRouteData } from './projects-routes-data'
import { NgxMetaService } from '@davidlj95/ngx-meta/core'
import { SanitizeResourceUrlPipe } from '../sanitize-resource-url.pipe'

describe('ProjectDetailPageComponent', () => {
  let component: ProjectDetailPageComponent
  let fixture: ComponentFixture<ProjectDetailPageComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MockProvider(ActivatedRoute, {
          data: of({
            projectDetail: {
              title: 'Title',
              description: 'Description',
              youtubePlaylistId: 'Playlist ID',
            },
          } as ProjectDetailRouteData),
        }),
        MockProvider(NgxMetaService),
      ],
    })
    TestBed.overrideComponent(ProjectDetailPageComponent, {
      set: {
        imports: [
          MockComponents(ImagesSwiperComponent),
          SanitizeResourceUrlPipe,
        ],
      },
    })
    fixture = TestBed.createComponent(ProjectDetailPageComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
