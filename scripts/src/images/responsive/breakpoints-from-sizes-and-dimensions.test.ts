import { describe, it } from 'node:test'
import { SourceSizeList } from '../models/source-size-list'
import { breakpointsFromSizesAndDimensions } from './breakpoints-from-sizes-and-dimensions'
import { sourceSize } from '../models/source-size'
import { Px, Vw } from '../models/css-length'
import assert from 'node:assert'
import * as SIZES_IMPORT from '../sizes'
import { PROJECT_DETAIL_BY_PRESET_SIZE } from '../sizes'
import { ImageDimensions } from '@/app/common/images/image'
import { RESOLUTIONS } from './resolutions'

describe('Breakpoints from sizes and dimensions', () => {
  const SAMPLE_IMAGE_DIMENSIONS: ImageDimensions = {
    width: 3240,
    height: 2160,
  }
  const MIN_RES_WIDTH = Math.min(...RESOLUTIONS.map(({ width }) => width))
  const sut = breakpointsFromSizesAndDimensions

  it('should return high density breakpoints whilst respecting max width query', () => {
    const actual = sut(
      SAMPLE_IMAGE_DIMENSIONS,
      makeMockSizes(sourceSize(Px(MIN_RES_WIDTH))),
    )

    assert.deepStrictEqual(actual, [
      MIN_RES_WIDTH,
      MIN_RES_WIDTH * 2,
      MIN_RES_WIDTH * 3,
    ])
  })

  it('should not return breakpoints that upscale original image size', () => {
    const actual = sut(
      squaredDimensions(MIN_RES_WIDTH),
      makeMockSizes(sourceSize(Vw(100))),
    )

    assert.deepStrictEqual(actual, [MIN_RES_WIDTH])
  })

  const isSourceSizeList: (sizes: unknown) => boolean = (
    sizes,
  ): sizes is SourceSizeList =>
    typeof sizes === 'object' &&
    sizes !== null &&
    'sizes' in sizes &&
    Array.isArray(sizes.sizes)
  const EXISTING_SIZES: readonly [string, SourceSizeList][] = [
    ...Object.entries(SIZES_IMPORT).filter(
      (entry): entry is [string, SourceSizeList] => isSourceSizeList(entry[1]),
    ),
    ...Object.entries(PROJECT_DETAIL_BY_PRESET_SIZE).map<
      [string, SourceSizeList]
    >((entry) => [`PROJECT_DETAIL_${entry[0].toUpperCase()}`, entry[1]]),
  ]
  EXISTING_SIZES.forEach(([sizeName, sizes]) => {
    it(`should return expected breakpoints snapshot for ${sizeName}`, (t) => {
      t.assert.snapshot(sut(SAMPLE_IMAGE_DIMENSIONS, sizes))
    })
  })
})

const makeMockSizes = (...sizes: SourceSizeList['sizes']): SourceSizeList => ({
  sizes,
})

const squaredDimensions = (sideSize: number): ImageDimensions => ({
  width: sideSize,
  height: sideSize,
})
