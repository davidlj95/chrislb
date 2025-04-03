export interface Image {
  src: string
  width: number
  height: number
  alt?: string
  params?: Record<string, string>
}

export type ResponsiveImage = Image & {
  readonly breakpoints: ResponsiveImageBreakpoints
  readonly sizes?: string
}

export type ResponsiveImageBreakpoints = readonly number[]
