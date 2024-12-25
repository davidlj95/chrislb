import { CssUnit } from './unit/css-unit'
import { CssMediaFeature } from './css-media-feature'

export class CssMaxWidthMediaFeature<
  U extends CssUnit,
> extends CssMediaFeature<U> {
  readonly name = 'max-width'

  constructor(readonly value: U) {
    super()
  }

  static from<U extends CssUnit>(maxWidth: U) {
    return new this(maxWidth)
  }
}
