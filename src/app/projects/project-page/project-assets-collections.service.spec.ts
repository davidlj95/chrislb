import { TestBed } from '@angular/core/testing'

import { ProjectAssetsCollectionsService } from './project-assets-collections.service'
import { MockProviders } from 'ng-mocks'
import { JsonFetcher } from '../../common/json-fetcher/json-fetcher'

describe('ProjectAssetsCollectionsService', () => {
  let service: ProjectAssetsCollectionsService

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: MockProviders(JsonFetcher) })
    service = TestBed.inject(ProjectAssetsCollectionsService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
