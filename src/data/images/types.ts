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

export interface PreviewImagesByProjectSlug {
  [slug: string]: ReadonlyArray<ImageAsset>
}

export interface LookbooksByProjectSlug {
  [slug: string]: LookbookImagesBySlug
}

export interface LookbookImagesBySlug {
  [slug: string]: ReadonlyArray<ImageAsset>
}
