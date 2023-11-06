import { CssMediaQuery } from './css-media-query'

export abstract class CssMediaFeature<T> implements CssMediaQuery {
  public abstract readonly name: string
  public abstract readonly value: T

  public toString(): string {
    return `(${this.name}: ${this.value})`
  }
}
