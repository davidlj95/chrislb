import { SourceSize } from './source-size'

export class SourceSizes {
  constructor(readonly sizes: readonly SourceSize[]) {
    if (sizes.length === 0) {
      throw new Error('At least one size must be specified')
    }
    if (sizes.slice(0, -1).some((size) => !size.mediaCondition)) {
      throw new Error('All but last size must have a media condition')
    }
    if (sizes.at(-1)!.mediaCondition) {
      throw new Error('Last size must not have a media condition')
    }
  }

  toString() {
    return this.sizes.join(',')
  }
}

export const sourceSizes = (...sizes: readonly SourceSize[]): SourceSizes =>
  new SourceSizes(sizes)
