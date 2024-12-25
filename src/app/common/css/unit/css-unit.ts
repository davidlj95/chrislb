export abstract class CssUnit {
  abstract readonly value: number
  abstract readonly unit: string

  toString(): string {
    return `${this.value}${this.unit}`
  }
}
