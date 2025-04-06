import { Pipe, PipeTransform } from '@angular/core'
import {
  areBreakpointsUnsigned,
  ORIGINAL_SRC_BREAKPOINT,
  ResponsiveImageBreakpoints,
} from '@/app/common/images/image'

@Pipe({ name: 'toNgSrcSet', standalone: true, pure: true })
export class ToNgSrcSet implements PipeTransform {
  transform(breakpoints: ResponsiveImageBreakpoints): string {
    const unsignedBreakpoints = areBreakpointsUnsigned(breakpoints)
      ? breakpoints
      : Object.keys(breakpoints)
          .filter((breakpoint) => breakpoint !== ORIGINAL_SRC_BREAKPOINT)
          .map((breakpoint) => parseInt(breakpoint))
    return unsignedBreakpoints.map((breakpoint) => `${breakpoint}w`).join(', ')
  }
}
