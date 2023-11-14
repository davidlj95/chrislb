import { ComponentFixture, TestBed } from '@angular/core/testing'

import { AboutPageComponent } from './about-page.component'
import { NgOptimizedImage } from '@angular/common'
import { MockComponents, MockProviders } from 'ng-mocks'
import { SocialComponent } from './social/social.component'
import { ResumeComponent } from './resume/resume.component'
import { getDummyOptimizedImageProviders } from '../../test/optimized-image'
import { MetadataService } from '@davidlj95/ngx-meta/core'

describe('AboutPageComponent', () => {
  let component: AboutPageComponent
  let fixture: ComponentFixture<AboutPageComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        AboutPageComponent,
        MockComponents(SocialComponent, ResumeComponent),
      ],
      imports: [NgOptimizedImage],
      providers: [
        ...getDummyOptimizedImageProviders(),
        MockProviders(MetadataService),
      ],
    })
    fixture = TestBed.createComponent(AboutPageComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
