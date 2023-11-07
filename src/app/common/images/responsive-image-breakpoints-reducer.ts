// Amount of bytes Lighthouse considers is good enough to avoid generating a new breakpoint
// https://github.com/GoogleChrome/lighthouse/blob/v11.3.0/core/audits/byte-efficiency/uses-responsive-images.js#L34-L37C55
const LIGHTHOUSE_BYTES_THRESHOLD = 12288
// Amount of bytes each pixel takes (not considering compression)
// at a true color bit depth
const PX_SIZE_BYTES = 3
const LIGHTHOUSE_PX_THRESHOLD = LIGHTHOUSE_BYTES_THRESHOLD / PX_SIZE_BYTES
// Assuming portrait (where each width increase means moar pixels than if squared or landscape)
const PORTRAIT_ASPECT_RATIO = 16 / 9
const MINIMUM_PX_DISTANCE_BETWEEN_BREAKPOINTS = Math.floor(
  Math.sqrt(LIGHTHOUSE_PX_THRESHOLD) * PORTRAIT_ASPECT_RATIO,
)

/**
 * Reduces the amount of responsive image breakpoints for a `srcSet` in a list
 * by grouping those that are very close together, and choosing the maximum
 * breakpoint of the group
 *
 * Breakpoints are grouped by the approximate width that Lighthouse is happy to
 * avoid generating a new size for it. Approx 100px width (see constants above)
 */
export function responsiveImageBreakpointsReducer(
  breakpoints: ReadonlyArray<number>,
): number[] {
  const sortedBreakpoints = Array.from(breakpoints).sort((a, b) => a - b)
  const breakpointGroups: number[][] = []
  for (let i = 0; i < sortedBreakpoints.length; i++) {
    const breakpointGroup = []
    let j = 0
    for (j = 0; i + j < sortedBreakpoints.length; j++) {
      const breakpoint = sortedBreakpoints[i + j]
      if (breakpointGroup.length === 0) {
        breakpointGroup.push(sortedBreakpoints[i + j])
        continue
      }
      const diff = breakpoint - breakpointGroup[0]
      if (diff > MINIMUM_PX_DISTANCE_BETWEEN_BREAKPOINTS) {
        break
      }
      breakpointGroup.push(breakpoint)
    }
    breakpointGroups.push(breakpointGroup)
    i += j - 1
  }
  return breakpointGroups.map((breakpointGroup) => Math.max(...breakpointGroup))
}
