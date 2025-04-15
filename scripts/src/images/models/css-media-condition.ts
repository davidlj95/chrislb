import { CSS_PX_UNIT, CssLength, Px } from './css-length'

export class CssPxLimitMediaCondition {
  constructor(
    readonly limit: Limit,
    readonly dimension: Dimension,
    readonly length: CssLength<typeof CSS_PX_UNIT>,
  ) {}

  toString() {
    return `(${this.limit}-${this.dimension}: ${this.length})`
  }
}

export const MIN_LIMIT = 'min'
export const MAX_LIMIT = 'max'
type Limit = typeof MIN_LIMIT | typeof MAX_LIMIT

const WIDTH_DIMENSION = 'width'
const HEIGHT_DIMENSION = 'height'
type Dimension = typeof WIDTH_DIMENSION | typeof HEIGHT_DIMENSION

export const minWidth = (px: number) =>
  new CssPxLimitMediaCondition(MIN_LIMIT, WIDTH_DIMENSION, Px(px))
export const maxWidth = (px: number) =>
  new CssPxLimitMediaCondition(MAX_LIMIT, WIDTH_DIMENSION, Px(px))
export const maxHeight = (px: number) =>
  new CssPxLimitMediaCondition(MAX_LIMIT, HEIGHT_DIMENSION, Px(px))

export const invertMediaConditionMinMax = (
  mediaCondition: CssPxLimitMediaCondition,
) =>
  new CssPxLimitMediaCondition(
    mediaCondition.limit === MIN_LIMIT ? MAX_LIMIT : MIN_LIMIT,
    mediaCondition.dimension,
    mediaCondition.length,
  )
