import { TestBed } from '@angular/core/testing'
import { provideZonelessChangeDetection } from '@angular/core'

export const testbedSetup = (
  opts: Parameters<typeof TestBed.configureTestingModule>[0] = {},
) => {
  TestBed.configureTestingModule({
    ...opts,
    providers: [provideZonelessChangeDetection(), ...(opts.providers ?? [])],
  })
}
