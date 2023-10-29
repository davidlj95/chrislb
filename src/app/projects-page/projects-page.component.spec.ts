import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ProjectsPageComponent } from './projects-page.component'
import { MockComponents, MockProvider } from 'ng-mocks'
import { ProjectItemComponent } from './project-item/project-item.component'
import { ProjectsService } from './projects.service'

describe('ProjectsPageComponent', () => {
  let component: ProjectsPageComponent
  let fixture: ComponentFixture<ProjectsPageComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        ProjectsPageComponent,
        MockComponents(ProjectItemComponent),
      ],
      providers: [
        MockProvider(ProjectsService, {
          async getAll() {
            return []
          },
        }),
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
