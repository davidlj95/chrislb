import { ResponsiveImageBreakpoints } from '../images/responsive-image-breakpoints'

export class HtmlNgSrcSetAttribute {
  public readonly asString: string

  constructor(public readonly breakpoints: ResponsiveImageBreakpoints) {
    this.asString = this.breakpoints.list
      .map((breakpoint) => `${breakpoint.value}w`)
      .join(', ')
  }

  public with(...others: ReadonlyArray<HtmlNgSrcSetAttribute>) {
    return new HtmlNgSrcSetAttribute(
      this.breakpoints.with(...others.map(({ breakpoints }) => breakpoints)),
    )
  }
}