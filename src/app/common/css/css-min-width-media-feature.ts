import { CssMediaFeature } from './css-media-feature'
import { CssUnit } from './unit/css-unit'

export class CssMinWidthMediaFeature<
  U extends CssUnit,
> extends CssMediaFeature<U> {
  public readonly name = 'min-width'

  private constructor(public readonly value: U) {
    super()
  }

  public static from<U extends CssUnit>(minWidth: U) {
    return new this(minWidth)
  }
}
