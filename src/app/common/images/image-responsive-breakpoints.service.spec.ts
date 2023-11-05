import { TestBed } from '@angular/core/testing'

import { ImageResponsiveBreakpointsService } from './image-responsive-breakpoints.service'

describe('ImageResponsiveBreakpointsService', () => {
  let service: ImageResponsiveBreakpointsService

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(ImageResponsiveBreakpointsService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
