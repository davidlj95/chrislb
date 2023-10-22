import { FileObject } from 'imagekit/dist/libs/interfaces'

export const IMAGEKIT_URL = 'https://ik.imagekit.io/chrislb/'
export type ImageAsset = Pick<
  FileObject,
  'name' | 'filePath' | 'height' | 'width'
>
