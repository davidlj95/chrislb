import { ComponentFixture, TestBed } from '@angular/core/testing'

import { HomePageComponent } from './home-page.component'
import { MockComponents } from 'ng-mocks'
import { ProjectsComponent } from './projects/projects.component'
import { HeaderComponent } from '../header/header.component'

describe('HomePageComponent', () => {
  let component: HomePageComponent
  let fixture: ComponentFixture<HomePageComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HomePageComponent, MockComponents(ProjectsComponent)],
    })
    fixture = TestBed.createComponent(HomePageComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
