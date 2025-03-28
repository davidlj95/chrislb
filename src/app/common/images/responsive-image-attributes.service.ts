import { Injectable } from '@angular/core'
import { ResponsiveImageAttributes } from './responsive-image-attributes'
import { DEFAULT_RESOLUTIONS } from '@unpic/core/base'
import { CssVwUnit, Vw } from '../css/unit/vw'
import { CssMinMaxMediaQuery } from '../css/css-min-max-media-query'
import { HtmlImageSizesSingleAttribute } from '../html/html-image-sizes-single-attribute'
import { CssPxUnit } from '../css/unit/px'
import { HtmlImageSizesAttribute } from '../html/html-image-sizes-attribute'
import { ResponsiveImageBreakpoints } from './responsive-image-breakpoints'

/**
 * Creates responsive images attributes for use with Angular's optimized image
 * directive: `ngSrcSet` and `sizes` attributes
 *
 * Inspired from `unpic-img` lib. Can't use that lib because:
 *  - ImageKit CDN isn't supported
 *  - Doesn't provide proper `srcSet` and `sizes` for advanced layouts
 *
 * @see https://github.com/ascorbic/unpic-img/blob/core-v0.0.36/packages/core/src/core.ts#L200-L227
 * @see https://github.com/ascorbic/unpic-img/blob/core-v0.0.36/packages/core/src/core.ts#L315-L348
 */
@Injectable({
  providedIn: 'root',
})
export class ResponsiveImageAttributesService {
  /**
   * Equivalent of `unpic`'s constrained layout
   */
  fullWidthUntil(constrainedWidth: CssPxUnit): ResponsiveImageAttributes {
    return this.fixedSinceWidth(constrainedWidth).concat(
      this.vw(Vw(100), CssMinMaxMediaQuery.max(constrainedWidth)),
    )
  }

  fixedSinceWidth(
    width: CssPxUnit,
    { minWidth }: { minWidth?: CssPxUnit } = {},
  ): ResponsiveImageAttributes {
    return new ResponsiveImageAttributes(
      ResponsiveImageBreakpoints.from(getHighDensityBreakpoints(width.value)),
      new HtmlImageSizesAttribute([
        new HtmlImageSizesSingleAttribute(
          width,
          CssMinMaxMediaQuery.min(minWidth ?? width),
        ),
      ]),
    )
  }

  vw(
    vw: CssVwUnit,
    minMaxMediaQuery?: CssMinMaxMediaQuery<CssPxUnit, CssPxUnit>,
    { includeMediaQueryInSizes }: { includeMediaQueryInSizes?: boolean } = {},
  ) {
    const breakpointsAtFixedVw = RESOLUTIONS.filter(
      (resolutionWidth) =>
        (minMaxMediaQuery?.min?.value.value ?? -Infinity) <= resolutionWidth &&
        resolutionWidth <= (minMaxMediaQuery?.max?.value.value ?? Infinity),
    )
      .map((resolutionWidth) => {
        const pxBreakpointAtResolution = Math.ceil(
          (resolutionWidth * vw.value) / 100,
        )
        return getHighDensityBreakpoints(pxBreakpointAtResolution)
      })
      .flat()
    return new ResponsiveImageAttributes(
      ResponsiveImageBreakpoints.from(breakpointsAtFixedVw),
      new HtmlImageSizesAttribute([
        new HtmlImageSizesSingleAttribute(
          vw,
          includeMediaQueryInSizes ? minMaxMediaQuery : undefined,
        ),
      ]),
    )
  }
}

const MAX_RESOLUTION_WIDTH = Math.max(...DEFAULT_RESOLUTIONS)
//👇 For Lighthouse, as performs tests on a Moto G Power (412x823)
// Indeed it's quite common web resolution:
// https://gs.statcounter.com/screen-resolution-stats/mobile/worldwide
//
// Despite they are high density screens, so browsers will probably use
// bigger images
// Maybe if network allows only? So low density must be there too? 🤔
const MOBILE_RESOLUTIONS = [
  // 414, // Too similar
  412,
  // 393, // Too similar
  // 390, // Too similar
  360,
]
const MAX_MOBILE_RESOLUTION_WIDTH = Math.max(...MOBILE_RESOLUTIONS)
const RESOLUTIONS = Array.from(
  new Set([...DEFAULT_RESOLUTIONS, ...MOBILE_RESOLUTIONS]),
).sort((a, b) => a - b)

const getHighDensityBreakpoints = (pxWidth: number): readonly number[] => {
  const widths: number[] = [pxWidth]
  // Add double for high density screens if not bigger than max resolution width
  const doubleWidth = pxWidth * 2
  if (doubleWidth < MAX_RESOLUTION_WIDTH) {
    widths.push(doubleWidth)
  }
  // Add triple for mobile screens
  // Tested on Moto G Power (Lighthouse fav device) that dimensions are
  // 412x823 whilst resolution is 1080, so 2.6 density
  const tripleWidth = pxWidth * 3
  if (
    pxWidth < MAX_MOBILE_RESOLUTION_WIDTH &&
    tripleWidth < MAX_RESOLUTION_WIDTH
  ) {
    widths.push(tripleWidth)
  }
  return widths
}
