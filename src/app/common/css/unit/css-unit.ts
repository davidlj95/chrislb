export abstract class CssUnit {
  public abstract readonly value: number
  public abstract readonly unit: string

  toString(): string {
    return `${this.value}${this.unit}`
  }
}
