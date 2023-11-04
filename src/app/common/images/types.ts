import { FileObject } from 'imagekit/dist/libs/interfaces'

export type ImageAsset = Pick<
  FileObject,
  'name' | 'filePath' | 'height' | 'width'
> & {
  alt?: string
}

export interface LogoImages {
  horizontal: ImageAsset
}

export interface MiscImages {
  horizontalLogo: ImageAsset
  aboutPortrait: ImageAsset
}
