import { CssMediaQuery } from './css-media-query'

export abstract class CssMediaFeature<T> implements CssMediaQuery {
  abstract readonly name: string
  abstract readonly value: T

  toString(): string {
    return `(${this.name}: ${this.value})`
  }
}
