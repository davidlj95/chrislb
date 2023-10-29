import { ComponentFixture, TestBed } from '@angular/core/testing'

import { LookbooksComponent } from './lookbooks.component'
import { MockComponents, MockProvider } from 'ng-mocks'
import { LookbookComponent } from './lookbook/lookbook.component'
import { ProjectLookbooksService } from './project-lookbooks.service'
import { of } from 'rxjs'

describe('LookbooksComponent', () => {
  let component: LookbooksComponent
  let fixture: ComponentFixture<LookbooksComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LookbooksComponent, MockComponents(LookbookComponent)],
      providers: [
        MockProvider(ProjectLookbooksService, {
          bySlug() {
            return of([])
          },
        }),
      ],
    })
    fixture = TestBed.createComponent(LookbooksComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
