import { describe, it } from 'node:test'
import { strictEqual } from 'node:assert'
import { sourceSizeList } from './source-size-list'
import { WidthSourceSize } from './source-size'
import { PROJECT_LIST_ITEM } from '../sizes'

describe('Source size list', () => {
  const SOURCE_SIZE_LIST = sourceSizeList(
    { toString: () => 'sourceSizeA', mediaCondition: {} } as WidthSourceSize,
    { toString: () => 'sourceSizeB' } as WidthSourceSize,
  )

  it('should join sizes by comma when representing it as a string', () => {
    strictEqual(
      SOURCE_SIZE_LIST.toString(),
      `${SOURCE_SIZE_LIST.sizes[0].toString()},${SOURCE_SIZE_LIST.sizes[1].toString()}`,
    )
  })

  it('should calculate properly height sizes', () => {
    const actual = PROJECT_LIST_ITEM.toString()
    strictEqual(actual, 'foo')
  })
})
