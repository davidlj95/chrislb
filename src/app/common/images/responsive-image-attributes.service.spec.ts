import { TestBed } from '@angular/core/testing'

import { ResponsiveImageAttributesService } from './responsive-image-attributes.service'
import { testbedSetup } from '../../../test/testbed-setup'

describe('ResponsiveImageService', () => {
  let service: ResponsiveImageAttributesService

  beforeEach(() => {
    testbedSetup()
    service = TestBed.inject(ResponsiveImageAttributesService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
