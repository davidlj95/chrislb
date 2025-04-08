import { CssLength } from './css-length'
import { CssPxLimitMediaCondition } from './css-media-condition'

// https://html.spec.whatwg.org/multipage/images.html#sizes-attribute
export class SourceSize {
  constructor(
    readonly length: CssLength | readonly CssLength[], // | 'auto'
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

const lengthAsString = (lengthOrLengths: SourceSize['length']): string => {
  if (!(Array.isArray as isCssLengthArray)(lengthOrLengths)) {
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

type isCssLengthArray = (
  lengthOrLengths: SourceSize['length'],
) => lengthOrLengths is readonly CssLength[]

export const sourceSize = (
  length: SourceSize['length'],
  mediaCondition?: SourceSize['mediaCondition'],
) => new SourceSize(length, mediaCondition)
