import { CssUnit } from './css-unit'

export class CssVwUnit extends CssUnit {
  readonly unit = 'vw'

  constructor(public readonly value: number) {
    if (value <= 0 || value > 100) {
      throw new Error(`Invalid vw value ${value}`)
    }
    super()
  }
}

export const Vw = (...args: ConstructorParameters<typeof CssVwUnit>) =>
  new CssVwUnit(...args)
