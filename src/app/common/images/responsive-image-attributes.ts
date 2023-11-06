export class ResponsiveImageAttributes {
  constructor(
    public readonly ngSrcSet: string,
    public readonly sizes: string,
  ) {}

  static fromBreakpointsAndSizes(
    pxBreakpoints: ReadonlyArray<number>,
    sizes: string,
  ) {
    return new this(
      pxBreakpoints.map((pxBreakpoint) => `${pxBreakpoint}w`).join(', '),
      sizes,
    )
  }
}
