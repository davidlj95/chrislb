import { Pipe, PipeTransform } from '@angular/core'
import {
  areBreakpointsUnsigned,
  ORIGINAL_SRC_BREAKPOINT,
  ResponsiveImageBreakpoints,
} from '@/app/common/images/image'

@Pipe({ name: 'toNgSrcSet', pure: true })
export class ToNgSrcSet implements PipeTransform {
  transform(breakpoints: ResponsiveImageBreakpoints): string {
    return unsignedBreakpoints(breakpoints)
      .map((breakpoint) => `${breakpoint}w`)
      .join(', ')
  }
}

export const unsignedBreakpoints = (breakpoints: ResponsiveImageBreakpoints) =>
  areBreakpointsUnsigned(breakpoints)
    ? breakpoints
    : Object.keys(breakpoints)
        .filter((breakpoint) => breakpoint !== ORIGINAL_SRC_BREAKPOINT)
        .map((breakpoint) => parseInt(breakpoint))
