import { HtmlImageSizesSingleAttribute } from './html-image-sizes-single-attribute'

export class HtmlImageSizesAttribute {
  public readonly asString: string

  constructor(
    public readonly sizes: ReadonlyArray<HtmlImageSizesSingleAttribute>,
  ) {
    this.asString = this.sizes.join(', ')
  }

  public concat(...others: ReadonlyArray<HtmlImageSizesAttribute>) {
    return new HtmlImageSizesAttribute([
      ...this.sizes,
      ...others.map(({ sizes }) => sizes).flat(),
    ])
  }
}
