import { TestBed } from '@angular/core/testing'

import { ProjectsService } from './projects.service'
import { JsonFetcher } from '../common/json-fetcher/json-fetcher-injection-token'
import { MockProviders } from 'ng-mocks'

describe('ProjectsService', () => {
  let service: ProjectsService

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [MockProviders(JsonFetcher)] })
    service = TestBed.inject(ProjectsService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
