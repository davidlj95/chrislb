import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ProjectsComponent } from './projects.component'
import { MockComponents } from 'ng-mocks'
import { ProjectItemComponent } from './project-item/project-item.component'

describe('ProjectsComponent', () => {
  let component: ProjectsComponent
  let fixture: ComponentFixture<ProjectsComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectsComponent, MockComponents(ProjectItemComponent)],
    })
    fixture = TestBed.createComponent(ProjectsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
