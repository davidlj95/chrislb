import { TestBed } from '@angular/core/testing'
import { AppComponent } from './app.component'
import { MockComponents } from 'ng-mocks'
import { HeaderComponent } from './header/header.component'
import { LogoComponent } from './logo/logo.component'
import { RouterOutlet } from '@angular/router'

describe('AppComponent', () => {
  beforeEach(() => {
    TestBed.overrideComponent(AppComponent, {
      set: {
        imports: [RouterOutlet, MockComponents(HeaderComponent, LogoComponent)],
      },
    })
  })

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent)
    const app = fixture.componentInstance
    expect(app).toBeTruthy()
  })
})
