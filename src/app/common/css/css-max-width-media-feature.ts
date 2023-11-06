import { CssUnit } from './unit/css-unit'
import { CssMediaFeature } from './css-media-feature'

export class CssMaxWidthMediaFeature<
  U extends CssUnit,
> extends CssMediaFeature<U> {
  public readonly name = 'max-width'

  constructor(public readonly value: U) {
    super()
  }

  public static from<U extends CssUnit>(maxWidth: U) {
    return new this(maxWidth)
  }
}
