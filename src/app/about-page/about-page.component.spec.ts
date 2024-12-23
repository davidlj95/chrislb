import { ComponentFixture, TestBed } from '@angular/core/testing'

import { AboutPageComponent } from './about-page.component'
import { MockComponents } from 'ng-mocks'
import { SocialComponent } from './social/social.component'
import { ResumeComponent } from './resume/resume.component'
import { getDummyOptimizedImageProviders } from '../../test/optimized-image'
import { NgOptimizedImage } from '@angular/common'

describe('AboutPageComponent', () => {
  let component: AboutPageComponent
  let fixture: ComponentFixture<AboutPageComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [...getDummyOptimizedImageProviders()],
    })
    TestBed.overrideComponent(AboutPageComponent, {
      set: {
        imports: [
          NgOptimizedImage,
          MockComponents(SocialComponent, ResumeComponent),
        ],
      },
    })
    fixture = TestBed.createComponent(AboutPageComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
