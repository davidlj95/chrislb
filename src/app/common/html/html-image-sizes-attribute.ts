import { HtmlImageSizesSingleAttribute } from './html-image-sizes-single-attribute'

export class HtmlImageSizesAttribute {
  public readonly asString: string

  constructor(public readonly sizes: readonly HtmlImageSizesSingleAttribute[]) {
    this.asString = this.sizes.join(', ')
  }

  public concat(...others: readonly HtmlImageSizesAttribute[]) {
    return new HtmlImageSizesAttribute([
      ...this.sizes,
      ...others.map(({ sizes }) => sizes).flat(),
    ])
  }
}
