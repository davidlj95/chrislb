import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ProjectListItemComponent } from './project-list-item.component'
import { MockComponents } from 'ng-mocks'
import { ImagesSwiperGlidejsComponent } from '../../images-swiper-glidejs/images-swiper-glidejs.component'

describe('ProjectListItemComponent', () => {
  let component: ProjectListItemComponent
  let fixture: ComponentFixture<ProjectListItemComponent>

  beforeEach(() => {
    TestBed.overrideComponent(ProjectListItemComponent, {
      set: {
        imports: [MockComponents(ImagesSwiperGlidejsComponent)],
      },
    })
    fixture = TestBed.createComponent(ProjectListItemComponent)
    component = fixture.componentInstance
    // TODO: proper tests
    //fixture.detectChanges();
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
