import { HtmlImageSizesAttribute } from '../html/html-image-sizes-attribute'
import { HtmlNgSrcSetAttribute } from '../html/html-ng-src-set-attribute'

export class ResponsiveImageAttributes {
  constructor(
    public readonly ngSrcSet: HtmlNgSrcSetAttribute,
    public readonly sizes: HtmlImageSizesAttribute,
  ) {}

  public with(
    ...others: ReadonlyArray<ResponsiveImageAttributes>
  ): ResponsiveImageAttributes {
    return new ResponsiveImageAttributes(
      this.ngSrcSet.with(...others.map(({ ngSrcSet }) => ngSrcSet)),
      this.sizes.with(...others.map(({ sizes }) => sizes)),
    )
  }
}
