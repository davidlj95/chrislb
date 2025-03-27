export interface ImageAsset {
  filename: string
  width: number
  height: number
  breakpoints: ImageAssetBreakpoints
  alt?: string
}

export type ImageAssetBreakpoints = readonly number[]

// Based on `chiasma_101.jpg` and `responsivebreakpoints.com` results
// Discarding resolutions > 1080p as high network bandwidth is assumed in there
export const DEFAULT_BREAKPOINTS = [200, 400, 580, 700, 830, 930, 1020, 1100]
