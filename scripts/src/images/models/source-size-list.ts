import {
  isHeightSourceSize,
  isWidthSourceSize,
  SourceSize,
} from './source-size'

export class SourceSizeList {
  constructor(readonly sizes: readonly SourceSize[]) {
    if (sizes.length === 0) {
      throw new Error('At least one size must be specified')
    }
    if (
      sizes
        .slice(0, -1)
        .some((size) => isWidthSourceSize(size) && !size.mediaCondition)
    ) {
      throw new Error(
        'All but last size must specify widths and have a media condition',
      )
    }
    const lastSourceSize = sizes.at(-1)!

    if (isWidthSourceSize(lastSourceSize) && lastSourceSize.mediaCondition) {
      throw new Error('Last size must not have a media condition')
    }

    if (isHeightSourceSize(lastSourceSize)) {
      lastSourceSize.sourceSizeList = this
    }
  }

  toString() {
    return this.sizes.join(',')
  }
}

export const sourceSizeList = (
  ...sizes: readonly SourceSize[]
): SourceSizeList => new SourceSizeList(sizes)
