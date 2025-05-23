import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ProjectListItemComponent } from './project-list-item.component'
import { MockComponents } from 'ng-mocks'
import { ImagesSwiperComponent } from '../../images-swiper/images-swiper.component'
import { testbedSetup } from '../../../../test/testbed-setup'

describe('ProjectListItemComponent', () => {
  let component: ProjectListItemComponent
  let fixture: ComponentFixture<ProjectListItemComponent>

  beforeEach(() => {
    testbedSetup()
    TestBed.overrideComponent(ProjectListItemComponent, {
      set: {
        imports: [MockComponents(ImagesSwiperComponent)],
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
