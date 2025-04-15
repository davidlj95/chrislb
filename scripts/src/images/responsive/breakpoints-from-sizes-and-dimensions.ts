import { SourceSizeList } from '../models/source-size-list'
import { Breakpoints, ImageDimensions } from '@/app/common/images/image'
import { isHeightSourceSize, lengthToPx } from '../models/source-size'
import {
  MAX_MOBILE_RESOLUTION_WIDTH,
  MAX_RESOLUTION_WIDTH,
  RESOLUTIONS,
  resolutionWidthMatchesMediaCondition,
} from './resolutions'

export const breakpointsFromSizesAndDimensions = (
  imageDimensions: ImageDimensions,
  sourceSizeList: SourceSizeList,
): Breakpoints =>
  reduceBreakpoints(
    uniq(
      sourceSizeList.sizes.reduce<BreakpointsAndResolutions>(
        (allBreakpointsAndResolutions, size) => {
          let removedItems = 0
          return allBreakpointsAndResolutions.resolutions.reduce<BreakpointsAndResolutions>(
            (breakpointsAndResolutions, resolution, index) => {
              if (isHeightSourceSize(size)) {
                const heightSizePx = lengthToPx(size.length, resolution.height)
                if (
                  wouldUpscale({
                    sizePx: heightSizePx,
                    maxPx: resolution.height,
                  })
                ) {
                  return breakpointsAndResolutions
                }
                const widthSizePx =
                  (heightSizePx * imageDimensions.width) /
                  imageDimensions.height
                const resolutions = [...breakpointsAndResolutions.resolutions]
                resolutions.splice(index - removedItems, 1)
                removedItems += 1
                return {
                  breakpoints: [
                    ...breakpointsAndResolutions.breakpoints,
                    ...getHighDensityBreakpoints(
                      widthSizePx,
                      imageDimensions.width,
                    ),
                  ],
                  resolutions,
                }
              }

              const widthSizePx = lengthToPx(size.length, resolution.width)
              if (
                !resolutionWidthMatchesMediaCondition(
                  resolution.width,
                  size.mediaCondition,
                ) ||
                wouldUpscale({
                  sizePx: widthSizePx,
                  maxPx: imageDimensions.width,
                })
              ) {
                return breakpointsAndResolutions
              }
              const breakpoints = [
                ...breakpointsAndResolutions.breakpoints,
                ...getHighDensityBreakpoints(
                  widthSizePx,
                  imageDimensions.width,
                ),
              ]
              const resolutions = [...breakpointsAndResolutions.resolutions]
              resolutions.splice(index - removedItems, 1)
              removedItems += 1
              return {
                breakpoints,
                resolutions,
              }
            },
            allBreakpointsAndResolutions,
          )
        },
        { breakpoints: [], resolutions: [...RESOLUTIONS] },
      ).breakpoints,
    ),
    estimateMaxPxBetweenBreakpoints(imageDimensions),
  )

interface BreakpointsAndResolutions {
  readonly breakpoints: Breakpoints
  readonly resolutions: readonly ImageDimensions[]
}

const wouldUpscale = (args: { sizePx: number; maxPx: number }) =>
  args.sizePx > args.maxPx

const uniq = (array: readonly number[]): number[] => Array.from(new Set(array))

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
