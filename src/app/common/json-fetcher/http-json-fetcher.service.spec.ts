import { TestBed } from '@angular/core/testing'

import { HttpJsonFetcherService } from './http-json-fetcher.service'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { MockProvider } from 'ng-mocks'
import { APP_BASE_HREF } from '@angular/common'

describe('HttpJsonFetcherService', () => {
  let service: HttpJsonFetcherService

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MockProvider(APP_BASE_HREF, '/'), HttpJsonFetcherService],
    })
    service = TestBed.inject(HttpJsonFetcherService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
