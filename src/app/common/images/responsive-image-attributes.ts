import { HtmlImageSizesAttribute } from '../html/html-image-sizes-attribute'
import { ResponsiveImageBreakpoints } from './responsive-image-breakpoints'

export class ResponsiveImageAttributes {
  constructor(
    public readonly breakpoints: ResponsiveImageBreakpoints,
    public readonly sizes: HtmlImageSizesAttribute,
  ) {}

  public reduce(): ResponsiveImageAttributes {
    return new ResponsiveImageAttributes(this.breakpoints.reduce(), this.sizes)
  }

  public concat(
    ...others: ReadonlyArray<ResponsiveImageAttributes>
  ): ResponsiveImageAttributes {
    return new ResponsiveImageAttributes(
      this.breakpoints.concat(...others.map(({ breakpoints }) => breakpoints)),
      this.sizes.concat(...others.map(({ sizes }) => sizes)),
    )
  }
}
