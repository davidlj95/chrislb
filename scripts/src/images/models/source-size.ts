import {
  RESOLUTIONS,
  resolutionWidthMatchesMediaCondition,
} from '../responsive/resolutions'
import {
  CSS_PX_UNIT,
  CSS_VH_UNIT,
  CSS_VW_UNIT,
  CssLength,
  HorizontalCssLength,
  Px,
  VerticalCssLength,
} from './css-length'
import { CssPxLimitMediaCondition, maxHeight } from './css-media-condition'
import { SourceSizeList } from './source-size-list'

export type SourceSize = WidthSourceSize | HeightSourceSize

interface SourceSizeBase {
  readonly length: OneOrMore<CssLength>
  readonly side: SourceSizeSide
}

const SOURCE_SIZE_WIDTH = 'w'
const SOURCE_SIZE_HEIGHT = 'h'
type SourceSizeSide = typeof SOURCE_SIZE_WIDTH | typeof SOURCE_SIZE_HEIGHT

// https://html.spec.whatwg.org/multipage/images.html#sizes-attribute
export class WidthSourceSize implements SourceSizeBase {
  readonly side = SOURCE_SIZE_WIDTH

  constructor(
    readonly length: OneOrMore<HorizontalCssLength>,
    readonly mediaCondition?: CssPxLimitMediaCondition,
  ) {}

  toString(): string {
    const lengthString = lengthAsString(this.length)
    if (this.mediaCondition === undefined) {
      return lengthString
    }
    return [this.mediaCondition, lengthString].join(' ')
  }
}

const lengthAsString = (lengthOrLengths: WidthSourceSize['length']): string => {
  if (!isArray(lengthOrLengths)) {
    return lengthOrLengths.toString()
  }
  const parts = lengthOrLengths
    .filter((length) => length.quantity !== 0)
    .map<string>((length, index) =>
      index === 0
        ? length.toString()
        : `${length.quantity > 0 ? '+' : '-'} ${Math.abs(length.quantity)}${length.unit}`,
    )
  return `calc(${parts.join(' ')})`
}

const isArray = <T>(oneOrMore: OneOrMore<T>): oneOrMore is readonly T[] =>
  Array.isArray(oneOrMore)

export type OneOrMore<T> = T | readonly T[]

export const sourceSize = (
  length: WidthSourceSize['length'],
  mediaCondition?: WidthSourceSize['mediaCondition'],
) => new WidthSourceSize(length, mediaCondition)

export const lengthToPx = (
  length: SourceSize['length'],
  viewportPx: number,
): number =>
  (Array.isArray(length) ? length : [length]).reduce<number>(
    (accumulator, length) => accumulator + singleLengthToPx(length, viewportPx),
    0,
  )

export const singleLengthToPx = (
  length: CssLength,
  viewportPx: number,
): number => {
  switch (length.unit) {
    case CSS_PX_UNIT:
      return length.quantity
    case CSS_VW_UNIT:
    case CSS_VH_UNIT:
      return Math.ceil((viewportPx * length.quantity) / 100)
  }
}

export const isWidthSourceSize = (
  sourceSize: SourceSize,
): sourceSize is WidthSourceSize => sourceSize.side === SOURCE_SIZE_WIDTH

export class HeightSourceSize implements SourceSizeBase {
  readonly side = SOURCE_SIZE_HEIGHT
  sourceSizeList?: SourceSizeList

  constructor(
    readonly length: VerticalCssLength | readonly VerticalCssLength[], // | 'auto'
  ) {}

  toString(): string {
    if (!this.sourceSizeList) {
      throw new Error(
        'A height source size must be inside a source size list to be serialized',
      )
    }
    const previousWidthSourceSizes =
      this.sourceSizeList.sizes.filter(isWidthSourceSize)
    const remainingResolutions = [...RESOLUTIONS]
    for (const size of previousWidthSourceSizes) {
      let removedItems = 0
      remainingResolutions.forEach((resolution, index) => {
        if (
          resolutionWidthMatchesMediaCondition(
            resolution.width,
            size.mediaCondition,
          )
        ) {
          remainingResolutions.splice(index - removedItems, 1)
          removedItems += 1
        }
      })
    }
    const remainingResolutionsSortedByHeight = remainingResolutions.sort(
      (resA, resB) => resA.height - resB.height,
    )
    const maxHeightAndWidth = remainingResolutionsSortedByHeight.map(
      (resolution) => {
        const imageHeightPx = lengthToPx(this.length, resolution.height)
        const imageWidthPx = imageHeightPx * 1 // ASPECT_RATIOOOOOR
        return [maxHeight(resolution.height), Px(imageWidthPx)] as const
      },
    )
    return maxHeightAndWidth
      .map(([maxHeight, widthPx]) => [maxHeight.toString(), widthPx].join(' '))
      .join(',')
  }
}

export const isHeightSourceSize = (
  sourceSize: SourceSize,
): sourceSize is HeightSourceSize => sourceSize.side === SOURCE_SIZE_HEIGHT

export const heightSourceSize = (length: HeightSourceSize['length']) =>
  new HeightSourceSize(length)
