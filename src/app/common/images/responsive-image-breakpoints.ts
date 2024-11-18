import { ResponsiveImageBreakpointsReducer } from './responsive-image-breakpoints-reducer'
import { HtmlNgSrcSetAttribute } from '../html/html-ng-src-set-attribute'
import { uniq } from 'lodash-es'

export class ResponsiveImageBreakpoints {
  public readonly ngSrcSet = new HtmlNgSrcSetAttribute(this)

  private constructor(public readonly pxList: readonly number[]) {}

  static from(list: readonly number[]): ResponsiveImageBreakpoints {
    const sortedUniqueBreakpointPxs = uniq(list).sort((a, b) => a - b)
    return new this(sortedUniqueBreakpointPxs)
  }

  public reduce() {
    return new ResponsiveImageBreakpoints(
      ResponsiveImageBreakpointsReducer.default().reduce(this.pxList),
    )
  }

  public concat(
    ...others: readonly ResponsiveImageBreakpoints[]
  ): ResponsiveImageBreakpoints {
    return ResponsiveImageBreakpoints.from(
      [...this.pxList, ...others.map(({ pxList }) => pxList)].flat(),
    )
  }
}
