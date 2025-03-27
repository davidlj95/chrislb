import { ComponentFixture, TestBed } from '@angular/core/testing'

import { NotFoundPageComponent } from './not-found-page.component'
import { testbedSetup } from '../../test/testbed-setup'

describe('NotFoundPageComponent', () => {
  let component: NotFoundPageComponent
  let fixture: ComponentFixture<NotFoundPageComponent>

  beforeEach(() => {
    testbedSetup()
    fixture = TestBed.createComponent(NotFoundPageComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
