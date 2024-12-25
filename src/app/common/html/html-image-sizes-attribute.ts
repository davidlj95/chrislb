import { HtmlImageSizesSingleAttribute } from './html-image-sizes-single-attribute'

export class HtmlImageSizesAttribute {
  readonly asString: string

  constructor(readonly sizes: readonly HtmlImageSizesSingleAttribute[]) {
    this.asString = this.sizes.join(', ')
  }

  concat(...others: readonly HtmlImageSizesAttribute[]) {
    return new HtmlImageSizesAttribute([
      ...this.sizes,
      ...others.map(({ sizes }) => sizes).flat(),
    ])
  }
}
