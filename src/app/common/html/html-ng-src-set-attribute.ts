import { ResponsiveImageBreakpoints } from '../images/responsive-image-breakpoints'

export class HtmlNgSrcSetAttribute {
  constructor(public readonly breakpoints: ResponsiveImageBreakpoints) {}

  public toString(): string {
    return this.breakpoints.list
      .map((breakpoint) => `${breakpoint.value}w`)
      .join(', ')
  }

  public with(...others: ReadonlyArray<HtmlNgSrcSetAttribute>) {
    return new HtmlNgSrcSetAttribute(
      this.breakpoints.with(...others.map(({ breakpoints }) => breakpoints)),
    )
  }
}
