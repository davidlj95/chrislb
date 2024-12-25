import { ResponsiveImageBreakpointsReducer } from './responsive-image-breakpoints-reducer'
import { HtmlNgSrcSetAttribute } from '../html/html-ng-src-set-attribute'
import { uniq } from 'lodash-es'

export class ResponsiveImageBreakpoints {
  readonly ngSrcSet = new HtmlNgSrcSetAttribute(this)

  private constructor(readonly pxList: readonly number[]) {}

  static from(list: readonly number[]): ResponsiveImageBreakpoints {
    const sortedUniqueBreakpointPxs = uniq(list).sort((a, b) => a - b)
    return new this(sortedUniqueBreakpointPxs)
  }

  reduce() {
    return new ResponsiveImageBreakpoints(
      ResponsiveImageBreakpointsReducer.default().reduce(this.pxList),
    )
  }

  concat(
    ...others: readonly ResponsiveImageBreakpoints[]
  ): ResponsiveImageBreakpoints {
    return ResponsiveImageBreakpoints.from(
      [...this.pxList, ...others.map(({ pxList }) => pxList)].flat(),
    )
  }
}
