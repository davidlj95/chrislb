import { ResponsiveImageBreakpoints } from '../images/responsive-image-breakpoints'

export class HtmlNgSrcSetAttribute {
  readonly asString: string

  constructor(readonly breakpoints: ResponsiveImageBreakpoints) {
    this.asString = this.breakpoints.pxList
      .map((breakpoint) => `${breakpoint}w`)
      .join(', ')
  }

  concat(...others: readonly HtmlNgSrcSetAttribute[]) {
    return new HtmlNgSrcSetAttribute(
      this.breakpoints.concat(...others.map(({ breakpoints }) => breakpoints)),
    )
  }
}
