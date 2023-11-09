import { ResponsiveImageBreakpoints } from '../images/responsive-image-breakpoints'

export class HtmlNgSrcSetAttribute {
  public readonly asString: string

  constructor(public readonly breakpoints: ResponsiveImageBreakpoints) {
    this.asString = this.breakpoints.pxList
      .map((breakpoint) => `${breakpoint}w`)
      .join(', ')
  }

  public concat(...others: ReadonlyArray<HtmlNgSrcSetAttribute>) {
    return new HtmlNgSrcSetAttribute(
      this.breakpoints.concat(...others.map(({ breakpoints }) => breakpoints)),
    )
  }
}
