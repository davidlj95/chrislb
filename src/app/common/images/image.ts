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

export type ResponsiveImageBreakpoints = readonly number[]
