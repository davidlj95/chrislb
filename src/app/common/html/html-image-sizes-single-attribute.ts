import { CssMediaQuery } from '../css/css-media-query'
import { CssUnit } from '../css/unit/css-unit'
import { isUndefined } from 'lodash-es'

export class HtmlImageSizesSingleAttribute {
  constructor(
    public readonly width: CssUnit,
    public readonly mediaQuery?: CssMediaQuery,
  ) {}

  public toString(): string {
    if (isUndefined(this.mediaQuery)) {
      return this.width.toString()
    }
    return [this.mediaQuery, this.width].join(' ')
  }
}
