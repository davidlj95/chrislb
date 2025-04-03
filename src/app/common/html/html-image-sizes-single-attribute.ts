import { CssMediaQuery } from '../css/css-media-query'
import { CssUnit } from '../css/unit/css-unit'

export class HtmlImageSizesSingleAttribute {
  constructor(
    readonly width: CssUnit,
    readonly mediaQuery?: CssMediaQuery,
  ) {}

  toString(): string {
    if (this.mediaQuery === undefined) {
      return this.width.toString()
    }
    return [this.mediaQuery, this.width].join(' ')
  }
}
