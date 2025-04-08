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

export type CssUnit = typeof CSS_PX_UNIT | typeof CSS_VW_UNIT
export const CSS_PX_UNIT = 'px'
export const CSS_VW_UNIT = 'vw'

export const Px = (quantity: number) => new CssLength(quantity, CSS_PX_UNIT)
export const Vw = (quantity: number) => {
  if (quantity < 0 || quantity > 100) {
    throw new Error(
      `Invalid ${quantity} ${CSS_VW_UNIT} quantity: must be > 0 and <= 100`,
    )
  }
  return new CssLength(quantity, CSS_VW_UNIT)
}
