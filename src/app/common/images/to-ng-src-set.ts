import { ResponsiveImageBreakpoints } from './responsive-image'
import { Pipe, PipeTransform } from '@angular/core'

@Pipe({ name: 'toNgSrcSet', standalone: true, pure: true })
export class ToNgSrcSet implements PipeTransform {
  transform(breakpoints: readonly number[]) {
    return toNgSrcSet(breakpoints)
  }
}

export const toNgSrcSet = (breakpoints: ResponsiveImageBreakpoints): string =>
  breakpoints.map((breakpoint) => `${breakpoint}w`).join(', ')
