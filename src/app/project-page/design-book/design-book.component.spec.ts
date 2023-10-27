import { ComponentFixture, TestBed } from '@angular/core/testing'

import { DesignBookComponent } from './design-book.component'
import { MockComponents } from 'ng-mocks'
import { ImageSwiperComponent } from '../../image-swiper/image-swiper.component'

describe('DesignBookComponent', () => {
  let component: DesignBookComponent
  let fixture: ComponentFixture<DesignBookComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DesignBookComponent, MockComponents(ImageSwiperComponent)],
    })
    fixture = TestBed.createComponent(DesignBookComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
