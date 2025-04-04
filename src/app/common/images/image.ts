export interface Image {
  src: string
  width: number
  height: number
  alt?: string
}

export type ResponsiveImage = Image & {
  readonly breakpoints: ResponsiveImageBreakpoints
  readonly sizes?: string
}

export type ResponsiveImageBreakpoints = Breakpoints | SignaturesByBreakpoint
export type Breakpoints = readonly number[]
export type SignaturesByBreakpoint = Record<string, string>

export const areBreakpointsUnsigned = (
  breakpoints: ResponsiveImageBreakpoints,
): breakpoints is Breakpoints => Array.isArray(breakpoints)
