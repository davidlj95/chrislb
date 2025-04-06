import { ImageLoaderConfig } from '@angular/common'

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

export interface LoaderParams {
  signaturesByBreakpoint?: SignaturesByBreakpoint
}

export const getBreakpointSignatureFromLoaderConfig = (
  loaderConfig: ImageLoaderConfig,
) => {
  const loaderParams = (loaderConfig.loaderParams ?? {}) as LoaderParams

  return loaderConfig.width
    ? (loaderParams.signaturesByBreakpoint ?? {})[loaderConfig.width.toString()]
    : undefined
}
