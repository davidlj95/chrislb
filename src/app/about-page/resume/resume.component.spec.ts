import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ResumeComponent } from './resume.component'
import { MockComponents, MockProvider } from 'ng-mocks'
import { FaIconComponent } from '@fortawesome/angular-fontawesome'
import { ResumeService } from './resume.service'
import { NgForOf } from '@angular/common'

describe('ResumeComponent', () => {
  let component: ResumeComponent
  let fixture: ComponentFixture<ResumeComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MockProvider(ResumeService)],
    })
    TestBed.overrideComponent(ResumeComponent, {
      set: { imports: [NgForOf, MockComponents(FaIconComponent)] },
    })
    fixture = TestBed.createComponent(ResumeComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
