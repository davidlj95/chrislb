import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ResumeComponent } from './resume.component'
import { MockComponents } from 'ng-mocks'
import { FaIconComponent } from '@fortawesome/angular-fontawesome'

describe('ResumeComponent', () => {
  let component: ResumeComponent
  let fixture: ComponentFixture<ResumeComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ResumeComponent, MockComponents(FaIconComponent)],
    })
    fixture = TestBed.createComponent(ResumeComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
