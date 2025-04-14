import { TestBed } from '@angular/core/testing'

import { HttpJsonFetcherService } from './http-json-fetcher.service'
import { provideHttpClientTesting } from '@angular/common/http/testing'
import { MockProvider } from 'ng-mocks'
import { APP_BASE_HREF } from '@angular/common'
import { provideHttpClient } from '@angular/common/http'
import { testbedSetup } from '../../../test/testbed-setup'

describe('HttpJsonFetcherService', () => {
  let service: HttpJsonFetcherService

  beforeEach(() => {
    testbedSetup({
      providers: [
        MockProvider(APP_BASE_HREF, '/'),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    })
    service = TestBed.inject(HttpJsonFetcherService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
