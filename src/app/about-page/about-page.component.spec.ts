import { ComponentFixture, TestBed } from '@angular/core/testing'

import { AboutPageComponent } from './about-page.component'
import { NgOptimizedImage } from '@angular/common'
import { MockComponents } from 'ng-mocks'
import { SocialComponent } from './social/social.component'

describe('AboutPageComponent', () => {
  let component: AboutPageComponent
  let fixture: ComponentFixture<AboutPageComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AboutPageComponent, MockComponents(SocialComponent)],
      imports: [NgOptimizedImage],
    })
    fixture = TestBed.createComponent(AboutPageComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
