import { ComponentFixture, TestBed } from '@angular/core/testing'

import { TechMaterialComponent } from './tech-material.component'
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('TechMaterialComponent', () => {
  let component: TechMaterialComponent
  let fixture: ComponentFixture<TechMaterialComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TechMaterialComponent],
      //👇 To include swiper element
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    fixture = TestBed.createComponent(TechMaterialComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
