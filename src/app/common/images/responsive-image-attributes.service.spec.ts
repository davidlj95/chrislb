import { TestBed } from '@angular/core/testing'

import { ResponsiveImageAttributesService } from './responsive-image-attributes.service'

describe('ResponsiveImageService', () => {
  let service: ResponsiveImageAttributesService

  beforeEach(() => {
    service = TestBed.inject(ResponsiveImageAttributesService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
