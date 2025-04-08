import { describe, it } from 'node:test'
import { strictEqual } from 'node:assert'
import { sourceSize } from './source-size'
import { Px, Vw } from './css-length'
import { CssPxLimitMediaCondition } from './css-media-condition'

describe('Source size', () => {
  const sut = sourceSize

  it('should print its length as a calc CSS function when length is an array', () => {
    strictEqual(
      sut([Px(100), Vw(50), Px(-16)]).toString(),
      'calc(100px + 50vw - 16px)',
    )
  })

  it('should print the media condition', () => {
    strictEqual(
      sut(Px(100), {
        toString: () => 'mediaCondition',
      } as CssPxLimitMediaCondition).toString(),
      'mediaCondition 100px',
    )
  })
})
