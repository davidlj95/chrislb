import { isSorted } from '../is-sorted'

/**
 * Reduces the amount of responsive image breakpoints for a `srcSet` in a list
 * by grouping those that are very close together, and choosing the maximum
 * breakpoint of the group
 *

 */
export class ResponsiveImageBreakpointsReducer {
  constructor(public readonly maxPxBetweenBreakpoints: number) {}

  /**
   * Creates a new reducer with the maximum allows distance between breakpoints
   * being the one that prevents Lighthouse from complaining
   */
  static default() {
    // Amount of bytes Lighthouse considers is good enough to avoid generating
    // a new image for that size
    // https://github.com/GoogleChrome/lighthouse/blob/v11.3.0/core/audits/byte-efficiency/uses-responsive-images.js#L34-L37C55
    const LIGHTHOUSE_BYTES_THRESHOLD = 12288
    // Amount of bytes each pixel takes (not considering compression) at a true
    // color bit depth
    const PX_SIZE_BYTES = 3
    const LIGHTHOUSE_PX_THRESHOLD = LIGHTHOUSE_BYTES_THRESHOLD / PX_SIZE_BYTES
    // Assuming portrait (where each width increase means more pixels than if squared or landscape)
    const PORTRAIT_ASPECT_RATIO = 16 / 9
    const MAX_PX_BETWEEN_BREAKPOINTS = Math.floor(
      Math.sqrt(LIGHTHOUSE_PX_THRESHOLD) * PORTRAIT_ASPECT_RATIO,
    )
    return new this(MAX_PX_BETWEEN_BREAKPOINTS)
  }

  public reduce(breakpoints: ReadonlyArray<number>): number[] {
    if (!isSorted(breakpoints)) {
      throw new Error('Breakpoints must be sorted before reducing them')
    }
    const reducedBreakpoints = [...breakpoints]
    for (let i = 0; i < reducedBreakpoints.length; i++) {
      const previous = i > 0 ? reducedBreakpoints[i - 1] : -Infinity
      const next =
        i + 1 < reducedBreakpoints.length ? reducedBreakpoints[i + 1] : Infinity
      const diffBetweenNeighbours = next - previous
      if (diffBetweenNeighbours <= this.maxPxBetweenBreakpoints) {
        reducedBreakpoints.splice(i, 1)
        //👇 Process next item taking into account there's an element less
        i -= 1
      }
    }
    return reducedBreakpoints
  }
}
