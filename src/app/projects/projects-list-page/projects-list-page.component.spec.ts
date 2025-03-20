import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ProjectsListPageComponent } from './projects-list-page.component'
import { MockComponents, MockProvider } from 'ng-mocks'
import { ProjectListItemComponent } from './project-list-item/project-list-item.component'
import { ProjectsService } from '../projects.service'

describe('ProjectsListPageComponent', () => {
  let component: ProjectsListPageComponent
  let fixture: ComponentFixture<ProjectsListPageComponent>

  beforeEach(() => {
    TestBed.overrideComponent(ProjectsListPageComponent, {
      set: {
        imports: [MockComponents(ProjectListItemComponent)],
        providers: [
          MockProvider(ProjectsService, {
            async getListItems() {
              return []
            },
          }),
        ],
      },
    })
    fixture = TestBed.createComponent(ProjectsListPageComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
