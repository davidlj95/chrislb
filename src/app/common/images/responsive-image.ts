export interface ResponsiveImage {
  filename: string
  width: number
  height: number
  alt?: string
  breakpoints: ResponsiveImageBreakpoints
}

export type ResponsiveImageBreakpoints = readonly number[]
