export class ImageResponsiveBreakpoints {
  constructor(public readonly pxValues: ReadonlyArray<number>) {}

  public toSrcSet(): string {
    return this.pxValues.map((breakpoint) => `${breakpoint}w`).join(', ')
  }
}
