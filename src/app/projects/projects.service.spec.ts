import { TestBed } from '@angular/core/testing'

import { ProjectsService } from './projects.service'
import { JsonFetcher } from '@/app/common/json/fetcher/json-fetcher'
import { MockProviders } from 'ng-mocks'
import { testbedSetup } from '../../test/testbed-setup'

describe('ProjectsService', () => {
  let service: ProjectsService

  beforeEach(() => {
    testbedSetup({
      providers: [ProjectsService, MockProviders(JsonFetcher)],
    })
    service = TestBed.inject(ProjectsService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
