import { describe, it } from 'node:test'
import { strictEqual } from 'node:assert'
import { sourceSizeList } from './source-size-list'
import { SourceSize } from './source-size'

describe('Source size list', () => {
  const SOURCE_SIZE_LIST = sourceSizeList(
    { toString: () => 'sourceSizeA', mediaCondition: {} } as SourceSize,
    { toString: () => 'sourceSizeB' } as SourceSize,
  )

  it('should join sizes by comma when representing it as a string', () => {
    strictEqual(
      SOURCE_SIZE_LIST.toString(),
      `${SOURCE_SIZE_LIST.sizes[0].toString()},${SOURCE_SIZE_LIST.sizes[1].toString()}`,
    )
  })
})
