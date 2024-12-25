import { CssUnit } from './css-unit'

export class CssPxUnit extends CssUnit {
  readonly unit = 'px'

  constructor(readonly value: number) {
    super()
  }
}

export const Px = (...args: ConstructorParameters<typeof CssPxUnit>) =>
  new CssPxUnit(...args)
