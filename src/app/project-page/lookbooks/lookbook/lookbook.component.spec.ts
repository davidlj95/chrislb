import { ComponentFixture, TestBed } from '@angular/core/testing'

import { LookbookComponent } from './lookbook.component'
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('LookbookComponent', () => {
  let component: LookbookComponent
  let fixture: ComponentFixture<LookbookComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LookbookComponent],
      //👇 To include swiper element
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    fixture = TestBed.createComponent(LookbookComponent)
    component = fixture.componentInstance
    component.lookbook = {
      slug: 'ego',
      images: [],
    }
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
