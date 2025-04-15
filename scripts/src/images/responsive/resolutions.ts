import { ImageDimensions } from '@/app/common/images/image'
import { WidthSourceSize } from '../models/source-size'
import { MAX_LIMIT, MIN_LIMIT } from '../models/css-media-condition'

type RawDimensions = [number, number] // [width, height]
// Filters them so there's only 1 per width
// Transforms them into objects
const resolutionsFromRawDimensions = (
  rawDimensions: readonly RawDimensions[],
): readonly ImageDimensions[] =>
  Object.entries(Object.fromEntries(rawDimensions))
    .map(([width, height]) => [parseInt(width), height])
    .map(([width, height]) => ({ width, height }))

// Despite they are high density screens, so browsers will probably use
// bigger images. Will calculate 1x, 2x, 3x for each one though.
// @visibleForTesting
const MOBILE_RESOLUTIONS = resolutionsFromRawDimensions([
  // 👇 Obtained from
  //    https://gs.statcounter.com/screen-resolution-stats/mobile/worldwide
  [360, 800],
  // [390, 844], // Too similar
  // [393, 873], // Too similar
  // [412, 915], // Too similar
  // [375, 812], // Too similar
  // [393, 852], // Too similar

  // 👇 Obtained from
  // https://www.browserstack.com/guide/common-screen-resolutions
  [360, 800],
  // [390, 844], // Too similar
  // [393, 873], // Too similar
  // [412, 915], // Too similar
  // [414, 896], // Too similar
  // [360, 780], // Too similar

  // 👇 For Lighthouse, as performs tests on a Moto G Power (412x823)
  // https://github.com/GoogleChrome/lighthouse/blob/v12.5.1/core/config/constants.js#L11-L22
  [412, 823],
])
export const MAX_MOBILE_RESOLUTION_WIDTH = Math.max(
  ...MOBILE_RESOLUTIONS.map(({ width }) => width),
)

const DESKTOP_RESOLUTIONS = resolutionsFromRawDimensions([
  // 👇 Obtained from
  //    https://gs.statcounter.com/screen-resolution-stats/desktop/worldwide
  [1920, 1080],
  [1536, 864],
  [1366, 768],
  [1280, 720],
  [1440, 900],
  [2560, 1440],
  // 👇 Obtained from
  //    https://www.browserstack.com/guide/common-screen-resolutions
  [1920, 1080],
  [1366, 768],
  [1536, 864],
  [1280, 720],
  [1440, 900],
  [1600, 1900],
])

export const RESOLUTIONS: readonly ImageDimensions[] = [
  ...MOBILE_RESOLUTIONS,
  ...DESKTOP_RESOLUTIONS,
].sort((resolutionA, resolutionB) => resolutionA.width - resolutionB.width)

export const MAX_RESOLUTION_WIDTH = Math.max(
  ...RESOLUTIONS.map(({ width }) => width),
)

export const resolutionWidthMatchesMediaCondition = (
  resolutionWidth: number,
  mediaCondition: WidthSourceSize['mediaCondition'],
): boolean => {
  if (!mediaCondition) return true
  switch (mediaCondition.limit) {
    case MIN_LIMIT:
      return resolutionWidth >= mediaCondition.length.quantity
    case MAX_LIMIT:
      return resolutionWidth <= mediaCondition.length.quantity
  }
}
