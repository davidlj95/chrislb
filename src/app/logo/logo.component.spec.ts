import { ComponentFixture, TestBed } from '@angular/core/testing'
import { LogoComponent } from './logo.component'
import { NgOptimizedImage } from '@angular/common'
import { getDummyOptimizedImageProviders } from '../../test/optimized-image'

describe('LogoComponent', () => {
  let component: LogoComponent
  let fixture: ComponentFixture<LogoComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LogoComponent],
      imports: [NgOptimizedImage],
      providers: [...getDummyOptimizedImageProviders()],
    })
    fixture = TestBed.createComponent(LogoComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
