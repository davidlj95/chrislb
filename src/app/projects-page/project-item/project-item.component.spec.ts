import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ProjectItemComponent } from './project-item.component'
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('ProjectItemComponent', () => {
  let component: ProjectItemComponent
  let fixture: ComponentFixture<ProjectItemComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectItemComponent],
      //👇 To include swiper element
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
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
