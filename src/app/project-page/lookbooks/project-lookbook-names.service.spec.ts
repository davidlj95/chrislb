import { TestBed } from '@angular/core/testing'

import { ProjectLookbookNamesService } from './project-lookbook-names.service'

describe('ProjectDetailsService', () => {
  let service: ProjectLookbookNamesService

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(ProjectLookbookNamesService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
