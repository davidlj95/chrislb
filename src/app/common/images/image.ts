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

export const ORIGINAL_SRC_BREAKPOINT = ''

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
  const width = loaderConfig.width?.toString() ?? ORIGINAL_SRC_BREAKPOINT
  return (loaderParams.signaturesByBreakpoint ?? {})[width]
}
