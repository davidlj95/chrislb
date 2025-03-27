import { provideExperimentalZonelessChangeDetection } from '@angular/core'
import { TestBed } from '@angular/core/testing'

export const testbedSetup = (
  opts: Parameters<typeof TestBed.configureTestingModule>[0] = {},
) => {
  TestBed.configureTestingModule({
    ...opts,
    providers: [
      provideExperimentalZonelessChangeDetection(),
      ...(opts.providers ?? []),
    ],
  })
}
