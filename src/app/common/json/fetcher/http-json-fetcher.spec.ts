import { TestBed } from '@angular/core/testing'

import { provideHttpClientTesting } from '@angular/common/http/testing'
import { MockProvider } from 'ng-mocks'
import { APP_BASE_HREF } from '@angular/common'
import { provideHttpClient } from '@angular/common/http'
import { testbedSetup } from '../../../../test/testbed-setup'
import { JsonFetcher } from '@/app/common/json/fetcher/json-fetcher'
import { HTTP_JSON_FETCHER } from '@/app/common/json/fetcher/http-json-fetcher'

describe('HTTP_JSON_FETCHER', () => {
  let sut: JsonFetcher

  beforeEach(() => {
    testbedSetup({
      providers: [
        MockProvider(APP_BASE_HREF, '/'),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    })
    sut = TestBed.inject(HTTP_JSON_FETCHER)
  })

  it('should be created', () => {
    expect(sut).toBeTruthy()
  })
})
