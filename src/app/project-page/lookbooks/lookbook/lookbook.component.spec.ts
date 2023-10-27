import { ComponentFixture, TestBed } from '@angular/core/testing'

import { LookbookComponent } from './lookbook.component'
import { MockComponents } from 'ng-mocks'
import { ImageSwiperComponent } from '../../../image-swiper/image-swiper.component'

describe('LookbookComponent', () => {
  let component: LookbookComponent
  let fixture: ComponentFixture<LookbookComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LookbookComponent, MockComponents(ImageSwiperComponent)],
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
