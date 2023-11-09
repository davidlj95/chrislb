import { ResponsiveImageBreakpointsReducer } from './responsive-image-breakpoints-reducer'
import { HtmlNgSrcSetAttribute } from '../html/html-ng-src-set-attribute'
import { uniq } from 'lodash-es'

export class ResponsiveImageBreakpoints {
  public readonly ngSrcSet = new HtmlNgSrcSetAttribute(this)

  private constructor(public readonly pxList: ReadonlyArray<number>) {}

  static from(list: ReadonlyArray<number>): ResponsiveImageBreakpoints {
    const sortedUniqueBreakpointPxs = uniq(list).sort((a, b) => a - b)
    return new this(sortedUniqueBreakpointPxs)
  }

  public reduce() {
    return new ResponsiveImageBreakpoints(
      ResponsiveImageBreakpointsReducer.default().reduce(this.pxList),
    )
  }

  public concat(
    ...others: ReadonlyArray<ResponsiveImageBreakpoints>
  ): ResponsiveImageBreakpoints {
    return ResponsiveImageBreakpoints.from(
      [...this.pxList, ...others.map(({ pxList }) => pxList)].flat(),
    )
  }
}
