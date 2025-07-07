import { SanitizeResourceUrlPipe } from './sanitize-resource-url.pipe'
import { testbedSetup } from '../../test/testbed-setup'
import { TestBed } from '@angular/core/testing'

describe('SanitizeResourceUrlPipe', () => {
  it('create an instance', () => {
    testbedSetup({ providers: [SanitizeResourceUrlPipe] })
    const pipe = TestBed.inject(SanitizeResourceUrlPipe)
    expect(pipe).toBeTruthy()
  })
})
