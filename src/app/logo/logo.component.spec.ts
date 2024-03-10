import { ComponentFixture, TestBed } from '@angular/core/testing'
import { LogoComponent } from './logo.component'
import { getDummyOptimizedImageProviders } from '../../test/optimized-image'
import { RouterTestingModule } from '@angular/router/testing'

describe('LogoComponent', () => {
  let component: LogoComponent
  let fixture: ComponentFixture<LogoComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
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
