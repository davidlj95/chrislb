import { ComponentFixture, TestBed } from '@angular/core/testing'
import { LogoComponent } from './logo.component'
import { provideRouter } from '@angular/router'
import { provideDummyOptimizedImage } from '../../test/provide-dummy-optimized-image'
import { testbedSetup } from '../../test/testbed-setup'

describe('LogoComponent', () => {
  let component: LogoComponent
  let fixture: ComponentFixture<LogoComponent>

  beforeEach(() => {
    testbedSetup({
      providers: [provideRouter([]), provideDummyOptimizedImage()],
    })
    fixture = TestBed.createComponent(LogoComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
