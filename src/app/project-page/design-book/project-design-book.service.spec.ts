import { TestBed } from '@angular/core/testing'

import { ProjectDesignBookService } from './project-design-book.service'

describe('ProjectDesignBookService', () => {
  let service: ProjectDesignBookService

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(ProjectDesignBookService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
