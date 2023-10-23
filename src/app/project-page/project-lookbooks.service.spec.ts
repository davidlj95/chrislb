import { TestBed } from '@angular/core/testing'

import { ProjectLookbooksService } from './project-lookbooks.service'

describe('ProjectLookbooksService', () => {
  let service: ProjectLookbooksService

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(ProjectLookbooksService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
