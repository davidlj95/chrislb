import { Injectable } from '@angular/core'
import { ResponsiveImageAttributes } from './responsive-image-attributes'
import { getBreakpoints } from '@unpic/core'

@Injectable({
  providedIn: 'root',
})
export class ResponsiveImageAttributesService {
  /**
   * Returns responsive image attributes for an image constrained in size
   *
   * Inspired from unpic lib. Can't use that lib because they don't support ImageKit
   * It's noted to contribute when have some time!
   *
   * Supports images that don't take full screen when on small screens (unlike unpic)
   *
   * @see https://github.com/ascorbic/unpic-img/blob/core-v0.0.35/packages/core/src/core.ts#L315-L348
   */
  public constrained({
    minWidthVw = 100,
    maxWidthPx,
  }: {
    minWidthVw?: number
    maxWidthPx: number
  }): ResponsiveImageAttributes {
    const maxWidthPxInt = Math.ceil(maxWidthPx)
    const breakpoints = getBreakpoints({
      width: maxWidthPxInt,
      layout: 'constrained',
    })
    const sizes = `(min-width: ${maxWidthPxInt}px) ${maxWidthPxInt}px, ${minWidthVw}vw`
    return ResponsiveImageAttributes.fromBreakpointsAndSizes(breakpoints, sizes)
  }
}
