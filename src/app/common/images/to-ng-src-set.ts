import { ImageAssetBreakpoints } from './image-asset'
import { Pipe, PipeTransform } from '@angular/core'

@Pipe({ name: 'toNgSrcSet', standalone: true, pure: true })
export class ToNgSrcSet implements PipeTransform {
  transform(breakpoints: readonly number[]) {
    return toNgSrcSet(breakpoints)
  }
}

export const toNgSrcSet = (breakpoints: ImageAssetBreakpoints): string =>
  breakpoints.map((breakpoint) => `${breakpoint}w`).join(', ')
