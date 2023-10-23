import { TestBed } from '@angular/core/testing'

import { ProjectPreviewImagesService } from './project-preview-images.service'

describe('ProjectPreviewImagesService', () => {
  let service: ProjectPreviewImagesService

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(ProjectPreviewImagesService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
