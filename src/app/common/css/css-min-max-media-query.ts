import { CssMinWidthMediaFeature } from './css-min-width-media-feature'
import { CssMaxWidthMediaFeature } from './css-max-width-media-feature'
import { CssMediaQuery } from './css-media-query'
import { CssUnit } from './unit/css-unit'
import { isUndefined } from 'lodash-es'

export class CssMinMaxMediaQuery<
  MinUnit extends CssUnit,
  MaxUnit extends CssUnit,
> implements CssMediaQuery
{
  public readonly min?: CssMinWidthMediaFeature<MinUnit>
  public readonly max?: CssMaxWidthMediaFeature<MaxUnit>

  private constructor({
    min,
    max,
  }:
    | {
        min: CssMinWidthMediaFeature<MinUnit>
        max?: CssMaxWidthMediaFeature<MaxUnit>
      }
    | {
        min?: CssMinWidthMediaFeature<MinUnit>
        max: CssMaxWidthMediaFeature<MaxUnit>
      }
    | {
        min: CssMinWidthMediaFeature<MinUnit>
        max: CssMaxWidthMediaFeature<MaxUnit>
      }) {
    this.min = min
    this.max = max
  }

  public static min<U extends CssUnit>(minWidth: U) {
    return new this<U, U>({ min: CssMinWidthMediaFeature.from(minWidth) })
  }

  public static max<U extends CssUnit>(maxWidth: U) {
    return new this<U, U>({ max: CssMaxWidthMediaFeature.from(maxWidth) })
  }

  public static minMax<MinUnit extends CssUnit, MaxUnit extends CssUnit>(
    minWidth: MinUnit,
    maxWidth: MaxUnit,
  ) {
    return new this({
      min: CssMinWidthMediaFeature.from(minWidth),
      max: CssMaxWidthMediaFeature.from(maxWidth),
    })
  }

  public toString(): string {
    const mediaFeatures = [this.min, this.max].filter(
      (mediaFeature) => !isUndefined(mediaFeature),
    )
    if (mediaFeatures.length === 1) {
      return mediaFeatures.join('')
    }
    return `(${mediaFeatures.join(' and ')})`
  }
}
