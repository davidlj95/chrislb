import { TestBed } from '@angular/core/testing'

import { LogoImagesService } from './logo-images.service'

describe('LogoImagesService', () => {
  let service: LogoImagesService

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(LogoImagesService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
