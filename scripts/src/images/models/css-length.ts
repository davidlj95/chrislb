export class CssLength<U extends CssUnit = CssUnit> {
  constructor(
    readonly quantity: number,
    readonly unit: U, // | undefined
  ) {}

  toString(): string {
    if (this.unit) {
      return `${this.quantity}${this.unit}`
    }
    return this.quantity.toString()
  }
}

export type CssUnit =
  | typeof CSS_PX_UNIT
  | typeof CSS_VW_UNIT
  | typeof CSS_VH_UNIT
export const CSS_PX_UNIT = 'px'
export const CSS_VW_UNIT = 'vw'
export const CSS_VH_UNIT = 'vh'

export type HorizontalCssUnit = typeof CSS_VW_UNIT | typeof CSS_PX_UNIT
export type HorizontalCssLength = CssLength<HorizontalCssUnit>

export type VerticalCssUnit = typeof CSS_VH_UNIT | typeof CSS_PX_UNIT
export type VerticalCssLength = CssLength<VerticalCssUnit>

export const Px = (quantity: number) => new CssLength(quantity, CSS_PX_UNIT)
export const Vw = (quantity: number) => new CssLength(quantity, CSS_VW_UNIT)
export const Vh = (quantity: number) => new CssLength(quantity, CSS_VH_UNIT)
