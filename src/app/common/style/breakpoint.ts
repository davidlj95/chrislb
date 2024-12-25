import { CssPxUnit, Px } from '../css/unit/px'

export class Breakpoint {
  private constructor(readonly px: CssPxUnit) {}

  get almost(): CssPxUnit {
    return Px(this.px.value - 0.02)
  }

  //👇 Keep in sync with breakpoints Scss
  static readonly Xs = new this(Px(600))
  static readonly S = new this(Px(960))
}
