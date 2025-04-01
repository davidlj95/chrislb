export interface ImageAsset {
  filename: string
  width: number
  height: number
  breakpoints: ImageAssetBreakpoints
  alt?: string
}

export type ImageAssetBreakpoints = readonly number[]
