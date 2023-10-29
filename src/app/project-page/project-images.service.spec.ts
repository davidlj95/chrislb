import { TestBed } from '@angular/core/testing'

import { ProjectImagesService } from './project-images.service'
import { MockProviders } from 'ng-mocks'
import { JsonFetcher } from '../common/json-fetcher/json-fetcher-injection-token'

describe('ProjectImagesService', () => {
  let service: ProjectImagesService

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: MockProviders(JsonFetcher) })
    service = TestBed.inject(ProjectImagesService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
