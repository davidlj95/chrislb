import { ComponentFixture, TestBed } from '@angular/core/testing'

import { LookbooksComponent } from './lookbooks.component'
import { MockComponents } from 'ng-mocks'
import { LookbookComponent } from './lookbook/lookbook.component'

describe('LookbooksComponent', () => {
  let component: LookbooksComponent
  let fixture: ComponentFixture<LookbooksComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LookbooksComponent, MockComponents(LookbookComponent)],
    })
    fixture = TestBed.createComponent(LookbooksComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
