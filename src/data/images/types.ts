import { FileObject } from 'imagekit/dist/libs/interfaces'

export type ImageAsset = Pick<
  FileObject,
  'name' | 'filePath' | 'height' | 'width'
> & {
  alt?: string
}
