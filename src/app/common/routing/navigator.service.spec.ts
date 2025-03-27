import { TestBed } from '@angular/core/testing'

import { NavigatorService } from './navigator.service'
import { testbedSetup } from '../../../test/testbed-setup'

describe('NavigatorService', () => {
  let service: NavigatorService

  beforeEach(() => {
    testbedSetup()
    service = TestBed.inject(NavigatorService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
