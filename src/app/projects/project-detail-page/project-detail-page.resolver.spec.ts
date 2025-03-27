import { TestBed } from '@angular/core/testing'
import { ProjectDetailPageResolver } from './project-detail-page-resolver.service'
import { MockProvider } from 'ng-mocks'
import { ProjectsService } from '../projects.service'
import { testbedSetup } from '../../../test/testbed-setup'

describe('ProjectDetailPageResolver', () => {
  beforeEach(() => {
    testbedSetup({
      providers: [ProjectDetailPageResolver, MockProvider(ProjectsService)],
    })
  })

  it('should be created', () => {
    expect(TestBed.inject(ProjectDetailPageResolver)).toBeTruthy()
  })
})
