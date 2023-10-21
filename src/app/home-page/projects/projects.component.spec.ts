import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ProjectsComponent } from './projects.component'
import { MockComponents, MockProvider } from 'ng-mocks'
import { ProjectItemComponent } from './project-item/project-item.component'
import { ProjectsService } from './projects.service'

describe('ProjectsComponent', () => {
  let component: ProjectsComponent
  let fixture: ComponentFixture<ProjectsComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectsComponent, MockComponents(ProjectItemComponent)],
      providers: [MockProvider(ProjectsService)],
    })
    fixture = TestBed.createComponent(ProjectsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
