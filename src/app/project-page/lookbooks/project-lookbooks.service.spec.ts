import { TestBed } from '@angular/core/testing'

import { ProjectLookbooksService } from './project-lookbooks.service'
import { MockProviders } from 'ng-mocks'
import { JsonFetcher } from '../../common/json-fetcher/json-fetcher'

describe('ProjectLookbooksService', () => {
  let service: ProjectLookbooksService

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: MockProviders(JsonFetcher) })
    service = TestBed.inject(ProjectLookbooksService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
