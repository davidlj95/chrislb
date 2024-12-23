import { ComponentFixture, TestBed } from '@angular/core/testing'

import { SocialComponent } from './social.component'
import { MockComponents } from 'ng-mocks'
import { FaIconComponent } from '@fortawesome/angular-fontawesome'

describe('SocialComponent', () => {
  let component: SocialComponent
  let fixture: ComponentFixture<SocialComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({})
    TestBed.overrideComponent(SocialComponent, {
      set: {
        imports: [MockComponents(FaIconComponent)],
      },
    })
    fixture = TestBed.createComponent(SocialComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
