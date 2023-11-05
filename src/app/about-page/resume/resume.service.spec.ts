import { TestBed } from '@angular/core/testing'

import { ResumeService } from './resume.service'

describe('ResumeService', () => {
  let service: ResumeService

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [ResumeService] })
    service = TestBed.inject(ResumeService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
