import { TestBed } from '@angular/core/testing'

import { ProjectTechMaterialService } from './project-tech-material.service'

describe('ProjectTechMaterialService', () => {
  let service: ProjectTechMaterialService

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(ProjectTechMaterialService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
