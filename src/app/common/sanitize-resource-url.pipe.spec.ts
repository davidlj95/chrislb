import { SanitizeResourceUrlPipe } from './sanitize-resource-url.pipe'
import { TestBed } from '@angular/core/testing'
import { DomSanitizer } from '@angular/platform-browser'

describe('SanitizeResourceUrlPipe', () => {
  it('create an instance', () => {
    TestBed.configureTestingModule({})
    const sanitizer = TestBed.inject(DomSanitizer)
    const pipe = new SanitizeResourceUrlPipe(sanitizer)
    expect(pipe).toBeTruthy()
  })
})
