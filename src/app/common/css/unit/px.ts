import { CssUnit } from './css-unit'

export class CssPxUnit extends CssUnit {
  public readonly unit = 'px'

  constructor(public readonly value: number) {
    super()
  }
}

export const Px = (...args: ConstructorParameters<typeof CssPxUnit>) =>
  new CssPxUnit(...args)
