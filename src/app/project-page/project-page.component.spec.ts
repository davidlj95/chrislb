import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ProjectPageComponent } from './project-page.component'
import { MockComponents, MockProvider } from 'ng-mocks'
import { LookbooksComponent } from './lookbooks/lookbooks.component'
import { TechMaterialComponent } from './tech-material/tech-material.component'
import { DesignBookComponent } from './design-book/design-book.component'
import { ProjectsService } from '../projects-page/projects.service'
import { Project } from '../projects-page/project-item/project-item'

describe('ProjectPageComponent', () => {
  let component: ProjectPageComponent
  let fixture: ComponentFixture<ProjectPageComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        ProjectPageComponent,
        MockComponents(
          LookbooksComponent,
          TechMaterialComponent,
          DesignBookComponent,
        ),
      ],
      providers: [
        MockProvider(ProjectsService, {
          async bySlug(): Promise<Project> {
            return { title: 'Title', description: 'Description' } as Project
          },
        }),
      ],
    })
    fixture = TestBed.createComponent(ProjectPageComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
