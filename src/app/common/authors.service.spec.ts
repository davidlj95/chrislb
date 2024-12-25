import { TestBed } from '@angular/core/testing'

import { AuthorsService } from './authors.service'

describe('AuthorsService', () => {
  let service: AuthorsService

  beforeEach(() => {
    service = TestBed.inject(AuthorsService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
