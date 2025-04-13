import { ComponentFixture, TestBed } from '@angular/core/testing'

import { AboutPageComponent } from './about-page.component'
import { MockComponents } from 'ng-mocks'
import { SocialComponent } from './social/social.component'
import { ResumeComponent } from './resume/resume.component'
import { provideDummyOptimizedImage } from '../../test/provide-dummy-optimized-image'
import { NgOptimizedImage } from '@angular/common'
import { testbedSetup } from '../../test/testbed-setup'
import { ToNgSrcSet } from '@/app/common/images/to-ng-src-set'
import { ToLoaderParams } from '@/app/common/images/to-loader-params'

describe('AboutPageComponent', () => {
  let component: AboutPageComponent
  let fixture: ComponentFixture<AboutPageComponent>

  beforeEach(() => {
    testbedSetup({
      providers: [provideDummyOptimizedImage()],
    })
    TestBed.overrideComponent(AboutPageComponent, {
      set: {
        imports: [
          NgOptimizedImage,
          MockComponents(SocialComponent, ResumeComponent),
          ToNgSrcSet,
          ToLoaderParams,
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
