import { HtmlImageSizesAttribute } from '../html/html-image-sizes-attribute'
import { ResponsiveImageBreakpoints } from './responsive-image-breakpoints'

export class ResponsiveImageAttributes {
  constructor(
    readonly breakpoints: ResponsiveImageBreakpoints,
    readonly sizes: HtmlImageSizesAttribute,
  ) {}

  reduce(): ResponsiveImageAttributes {
    return new ResponsiveImageAttributes(this.breakpoints.reduce(), this.sizes)
  }

  concat(
    ...others: readonly ResponsiveImageAttributes[]
  ): ResponsiveImageAttributes {
    return new ResponsiveImageAttributes(
      this.breakpoints.concat(...others.map(({ breakpoints }) => breakpoints)),
      this.sizes.concat(...others.map(({ sizes }) => sizes)),
    )
  }
}
