import { HtmlImageSizesSingleAttribute } from './html-image-sizes-single-attribute'

export class HtmlImageSizesAttribute {
  constructor(
    public readonly sizes: ReadonlyArray<HtmlImageSizesSingleAttribute>,
  ) {}

  public with(...others: ReadonlyArray<HtmlImageSizesAttribute>) {
    return new HtmlImageSizesAttribute([
      ...this.sizes,
      ...others.map(({ sizes }) => sizes).flat(),
    ])
  }

  public toString(): string {
    return this.sizes.join(', ')
  }
}
