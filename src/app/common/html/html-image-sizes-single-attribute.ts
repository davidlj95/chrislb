import { CssMediaQuery } from '../css/css-media-query'
import { CssUnit } from '../css/unit/css-unit'
import { isDefined } from '../is-defined'

export class HtmlImageSizesSingleAttribute {
  constructor(
    public readonly width: CssUnit,
    public readonly mediaQuery?: CssMediaQuery,
  ) {}

  public toString(): string {
    const parts = [this.mediaQuery, this.width].filter(isDefined)
    return parts.map((part) => part.toString()).join(' ')
  }
}
