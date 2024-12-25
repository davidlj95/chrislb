import { CssMediaFeature } from './css-media-feature'
import { CssUnit } from './unit/css-unit'

export class CssMinWidthMediaFeature<
  U extends CssUnit,
> extends CssMediaFeature<U> {
  readonly name = 'min-width'

  private constructor(readonly value: U) {
    super()
  }

  static from<U extends CssUnit>(minWidth: U) {
    return new this(minWidth)
  }
}
