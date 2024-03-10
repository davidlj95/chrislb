import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ResumeComponent } from './resume.component'
import { MockComponents, MockProvider } from 'ng-mocks'
import { FaIconComponent } from '@fortawesome/angular-fontawesome'
import { ResumeService } from './resume.service'

describe('ResumeComponent', () => {
  let component: ResumeComponent
  let fixture: ComponentFixture<ResumeComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ResumeComponent, MockComponents(FaIconComponent)],
      providers: [MockProvider(ResumeService)],
    })
    fixture = TestBed.createComponent(ResumeComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
