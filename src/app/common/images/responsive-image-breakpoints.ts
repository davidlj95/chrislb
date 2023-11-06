import { CssPxUnit, Px } from '../css/unit/px'
import { responsiveImageBreakpointsReducer } from './responsive-image-breakpoints-reducer'

export class ResponsiveImageBreakpoints {
  private constructor(public readonly list: ReadonlyArray<CssPxUnit>) {}

  static from(list: ReadonlyArray<CssPxUnit>): ResponsiveImageBreakpoints {
    return new this(
      responsiveImageBreakpointsReducer(
        list.map((breakpoint) => breakpoint.value),
      ).map((breakpoint) => Px(breakpoint)),
    )
  }

  public with(
    ...others: ReadonlyArray<ResponsiveImageBreakpoints>
  ): ResponsiveImageBreakpoints {
    return ResponsiveImageBreakpoints.from(
      [...this.list, ...others.map(({ list }) => list)].flat(),
    )
  }
}
