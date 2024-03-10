import { ComponentFixture, TestBed } from '@angular/core/testing'

import { AboutPageComponent } from './about-page.component'
import { NgOptimizedImage } from '@angular/common'
import { MockComponents } from 'ng-mocks'
import { SocialComponent } from './social/social.component'
import { ResumeComponent } from './resume/resume.component'
import { getDummyOptimizedImageProviders } from '../../test/optimized-image'

describe('AboutPageComponent', () => {
  let component: AboutPageComponent
  let fixture: ComponentFixture<AboutPageComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NgOptimizedImage,
        AboutPageComponent,
        MockComponents(SocialComponent, ResumeComponent),
      ],
      providers: [...getDummyOptimizedImageProviders()],
    })
    fixture = TestBed.createComponent(AboutPageComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
