import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ProjectsPageComponent } from './projects-page.component'
import { MockComponents } from 'ng-mocks'
import { ProjectItemComponent } from './project-item/project-item.component'

describe('ProjectsPageComponent', () => {
  let component: ProjectsPageComponent
  let fixture: ComponentFixture<ProjectsPageComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        ProjectsPageComponent,
        MockComponents(ProjectItemComponent),
      ],
    })
    fixture = TestBed.createComponent(ProjectsPageComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
