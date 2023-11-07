import { Injectable } from '@angular/core'
import { ResponsiveImageAttributes } from './responsive-image-attributes'
import { DEFAULT_RESOLUTIONS, getBreakpoints } from '@unpic/core'
import { CssVwUnit, Vw } from '../css/unit/vw'
import { CssMinMaxMediaQuery } from '../css/css-min-max-media-query'
import { HtmlImageSizesSingleAttribute } from '../html/html-image-sizes-single-attribute'
import { CssPxUnit, Px } from '../css/unit/px'
import { HtmlNgSrcSetAttribute } from '../html/html-ng-src-set-attribute'
import { HtmlImageSizesAttribute } from '../html/html-image-sizes-attribute'
import { ResponsiveImageBreakpoints } from './responsive-image-breakpoints'

@Injectable({
  providedIn: 'root',
})
export class ResponsiveImageAttributesService {
  private MAX_RESOLUTION_WIDTH = Math.max(...DEFAULT_RESOLUTIONS)

  /**
   * Returns responsive image attributes for an image constrained in size
   *
   * Inspired from unpic lib. Can't use that lib because they don't support ImageKit
   * It's noted to contribute when have some time!
   *
   * @see https://github.com/ascorbic/unpic-img/blob/core-v0.0.35/packages/core/src/core.ts#L315-L348
   */
  public constrained(constrainedWidth: CssPxUnit): ResponsiveImageAttributes {
    const breakpoints = getBreakpoints({
      width: constrainedWidth.value,
      layout: 'constrained',
    }).map((breakpoint) => Px(breakpoint))
    return new ResponsiveImageAttributes(
      new HtmlNgSrcSetAttribute(ResponsiveImageBreakpoints.from(breakpoints)),
      new HtmlImageSizesAttribute([
        new HtmlImageSizesSingleAttribute(
          constrainedWidth,
          CssMinMaxMediaQuery.min(constrainedWidth),
        ),
        new HtmlImageSizesSingleAttribute(Vw(100)),
      ]),
    )
  }

  public vw(
    vw: CssVwUnit,
    minMaxMediaQuery?: CssMinMaxMediaQuery<CssPxUnit, CssPxUnit>,
  ) {
    const breakpointsAtFixedVw = DEFAULT_RESOLUTIONS.filter(
      (resolutionWidth) =>
        (minMaxMediaQuery?.min?.value.value ?? -Infinity) <= resolutionWidth &&
        resolutionWidth <= (minMaxMediaQuery?.max?.value.value ?? Infinity),
    )
      .map((resolutionWidth) => {
        const breakpointAtResolution = Px(
          Math.ceil((resolutionWidth * vw.value) / 100),
        )
        const breakpointsAtResolution = [breakpointAtResolution]
        const doubleBreakpointAtResolution = Px(
          breakpointAtResolution.value * 2,
        )
        // Add double for high density screens if not bigger than max resolution width
        if (doubleBreakpointAtResolution.value <= this.MAX_RESOLUTION_WIDTH) {
          breakpointsAtResolution.push(doubleBreakpointAtResolution)
        }
        return breakpointsAtResolution
      })
      .flat()
    return new ResponsiveImageAttributes(
      new HtmlNgSrcSetAttribute(
        ResponsiveImageBreakpoints.from(breakpointsAtFixedVw),
      ),
      new HtmlImageSizesAttribute([
        new HtmlImageSizesSingleAttribute(vw, minMaxMediaQuery),
      ]),
    )
  }
}
