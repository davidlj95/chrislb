import { TestBed } from '@angular/core/testing'
import { ProjectDetailPageResolver } from './project-detail-page-resolver.service'
import { MockProvider } from 'ng-mocks'
import { ProjectsService } from '../projects.service'

describe('ProjectDetailPageResolver', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProjectDetailPageResolver, MockProvider(ProjectsService)],
    })
  })

  it('should be created', () => {
    expect(TestBed.inject(ProjectDetailPageResolver)).toBeTruthy()
  })
})
