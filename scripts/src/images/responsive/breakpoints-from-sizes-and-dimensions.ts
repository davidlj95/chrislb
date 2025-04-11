import { SourceSizeList } from '../models/source-size-list'
import { Breakpoints, ImageDimensions } from '@/app/common/images/image'
import { SourceSize } from '../models/source-size'
import { MAX_LIMIT, MIN_LIMIT } from '../models/css-media-condition'
import { CSS_PX_UNIT, CSS_VW_UNIT, CssLength } from '../models/css-length'
import { DEFAULT_RESOLUTIONS } from '@unpic/core/base'

export const breakpointsFromSizesAndDimensions = (
  imageDimensions: ImageDimensions,
  sourceSizeList: SourceSizeList,
): Breakpoints =>
  reduceBreakpoints(
    uniq(
      sourceSizeList.sizes.reduce<BreakpointsAndResolutionWidths>(
        (allBreakpointsAndWidths, size) => {
          const { length, mediaCondition } = size
          let removedItems = 0
          return allBreakpointsAndWidths.resolutionWidths.reduce<BreakpointsAndResolutionWidths>(
            (breakpointsAndWidths, resolutionWidth, index) => {
              if (
                applicableResolutionWidth(
                  resolutionWidth,
                  mediaCondition,
                  imageDimensions.width,
                )
              ) {
                const breakpoints = [
                  ...breakpointsAndWidths.breakpoints,
                  ...getHighDensityBreakpoints(
                    lengthToPx(length, resolutionWidth),
                    imageDimensions.width,
                  ),
                ]
                const resolutionWidths = [
                  ...breakpointsAndWidths.resolutionWidths,
                ]
                resolutionWidths.splice(index - removedItems, 1)
                removedItems += 1
                return {
                  breakpoints,
                  resolutionWidths,
                }
              }
              return breakpointsAndWidths
            },
            allBreakpointsAndWidths,
          )
        },
        { breakpoints: [], resolutionWidths: [...RESOLUTION_WIDTHS] },
      ).breakpoints,
    ),
    estimateMaxPxBetweenBreakpoints(imageDimensions),
  )

interface BreakpointsAndResolutionWidths {
  readonly breakpoints: readonly number[]
  readonly resolutionWidths: readonly number[]
}

const applicableResolutionWidth = (
  resolutionWidth: number,
  mediaCondition: SourceSize['mediaCondition'],
  imageWidth: number,
): boolean => {
  if (resolutionWidth > imageWidth) return false
  if (!mediaCondition) return true
  switch (mediaCondition.limit) {
    case MIN_LIMIT:
      return resolutionWidth >= mediaCondition.length.quantity
    case MAX_LIMIT:
      return resolutionWidth <= mediaCondition.length.quantity
  }
}

const lengthToPx = (
  length: SourceSize['length'],
  viewportWidth: number,
): number =>
  (Array.isArray(length) ? length : [length]).reduce<number>(
    (accumulator, length) =>
      accumulator + singleLengthToPx(length, viewportWidth),
    0,
  )

const singleLengthToPx = (length: CssLength, viewportWidth: number): number => {
  switch (length.unit) {
    case CSS_PX_UNIT:
      return length.quantity
    case CSS_VW_UNIT:
      return Math.ceil((viewportWidth * length.quantity) / 100)
  }
}

const uniq = (array: readonly number[]): number[] => Array.from(new Set(array))

const MAX_RESOLUTION_WIDTH = Math.max(...DEFAULT_RESOLUTIONS)
//👇 For Lighthouse, as performs tests on a Moto G Power (412x823)
// Indeed it's quite common web resolution:
// https://gs.statcounter.com/screen-resolution-stats/mobile/worldwide
//
// Despite they are high density screens, so browsers will probably use
// bigger images
// Maybe if network allows only? So low density must be there too? 🤔
// @visibleForTesting
export const MOBILE_RESOLUTION_WIDTHS = [
  // 414, // Too similar
  412,
  // 393, // Too similar
  // 390, // Too similar
  360,
]
const MAX_MOBILE_RESOLUTION_WIDTH = Math.max(...MOBILE_RESOLUTION_WIDTHS)
const RESOLUTION_WIDTHS = Array.from(
  new Set([...DEFAULT_RESOLUTIONS, ...MOBILE_RESOLUTION_WIDTHS]),
).sort((a, b) => a - b)

export const getHighDensityBreakpoints = (
  pxWidth: number,
  maxPxWidth: number,
): readonly number[] => {
  const widths: number[] = [pxWidth]

  // Add double for high density screens if not bigger than max resolution width
  const doubleWidth = pxWidth * 2
  if (doubleWidth < MAX_RESOLUTION_WIDTH && doubleWidth <= maxPxWidth) {
    widths.push(doubleWidth)
  }

  // Add triple for mobile screens
  // Tested on Moto G Power (Lighthouse fav device) that dimensions are
  // 412x823 whilst resolution is 1080, so 2.6 density
  const tripleWidth = pxWidth * 3
  if (
    pxWidth < MAX_MOBILE_RESOLUTION_WIDTH &&
    tripleWidth < MAX_RESOLUTION_WIDTH &&
    tripleWidth < maxPxWidth
  ) {
    widths.push(tripleWidth)
  }
  return widths
}

const reduceBreakpoints = (
  breakpoints: readonly number[],
  maxPxBetweenBreakpoints: number,
): number[] => {
  const reducedBreakpoints = [...breakpoints].sort((a, b) => a - b)
  for (let i = 0; i < reducedBreakpoints.length; i++) {
    const previous = i > 0 ? reducedBreakpoints[i - 1] : -Infinity
    const next =
      i + 1 < reducedBreakpoints.length ? reducedBreakpoints[i + 1] : Infinity
    const diffBetweenNeighbours = next - previous
    if (diffBetweenNeighbours <= maxPxBetweenBreakpoints) {
      reducedBreakpoints.splice(i, 1)
      //👇 Process next item taking into account there's an element less
      i -= 1
    }
  }
  return reducedBreakpoints
}

const estimateMaxPxBetweenBreakpoints = (dimensions: ImageDimensions) => {
  // Amount of bytes each pixel takes at a true color bit depth
  const PX_SIZE_BYTES = 3
  const COMPRESSION_RATIO = 0.5
  const LIGHTHOUSE_PX_THRESHOLD =
    LIGHTHOUSE_BYTES_THRESHOLD / (PX_SIZE_BYTES * COMPRESSION_RATIO)
  return Math.floor(
    Math.sqrt(LIGHTHOUSE_PX_THRESHOLD) * (dimensions.height / dimensions.width),
  )
}

// "Wasted" bytes Lighthouse considers are okay
// Hence no need to generate new size for the image
// https://github.com/GoogleChrome/lighthouse/blob/v12.5.1/core/audits/byte-efficiency/uses-responsive-images.js#L34
const LIGHTHOUSE_BYTES_THRESHOLD = 12288
