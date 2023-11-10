import { TestBed } from '@angular/core/testing'
import { ProjectPageResolver } from './project-page.resolver'
import { MockProvider } from 'ng-mocks'
import { ProjectsService } from '../projects.service'

describe('ProjectPageResolver', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProjectPageResolver, MockProvider(ProjectsService)],
    })
  })

  it('should be created', () => {
    expect(TestBed.inject(ProjectPageResolver)).toBeTruthy()
  })
})
