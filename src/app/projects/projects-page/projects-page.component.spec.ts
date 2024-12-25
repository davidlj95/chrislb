import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ProjectsPageComponent } from './projects-page.component'
import { MockComponents, MockProvider } from 'ng-mocks'
import { ProjectListItemComponent } from './project-list-item/project-list-item.component'
import { ProjectsService } from '../projects.service'
import { AsyncPipe } from '@angular/common'

describe('ProjectsPageComponent', () => {
  let component: ProjectsPageComponent
  let fixture: ComponentFixture<ProjectsPageComponent>

  beforeEach(() => {
    TestBed.overrideComponent(ProjectsPageComponent, {
      set: {
        imports: [AsyncPipe, MockComponents(ProjectListItemComponent)],
        providers: [
          MockProvider(ProjectsService, {
            async getListItems() {
              return []
            },
          }),
        ],
      },
    })
    fixture = TestBed.createComponent(ProjectsPageComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
