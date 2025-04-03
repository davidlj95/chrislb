import { CssLength } from './css-length'
import { CssPxLimitMediaCondition } from './css-media-condition'

// https://html.spec.whatwg.org/multipage/images.html#sizes-attribute
export class SourceSize {
  constructor(
    readonly length: CssLength, // | 'auto'
    readonly mediaCondition?: CssPxLimitMediaCondition,
  ) {}

  toString(): string {
    if (this.mediaCondition === undefined) {
      return this.length.toString()
    }
    return [this.mediaCondition, this.length].join(' ')
  }
}

export const sourceSize = (
  length: SourceSize['length'],
  mediaCondition?: SourceSize['mediaCondition'],
) => new SourceSize(length, mediaCondition)
