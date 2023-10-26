import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ProjectPageComponent } from './project-page.component'
import { MockComponents } from 'ng-mocks'
import { LookbooksComponent } from './lookbooks/lookbooks.component'
import { TechMaterialComponent } from './tech-material/tech-material.component'

describe('ProjectPageComponent', () => {
  let component: ProjectPageComponent
  let fixture: ComponentFixture<ProjectPageComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        ProjectPageComponent,
        MockComponents(LookbooksComponent, TechMaterialComponent),
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
