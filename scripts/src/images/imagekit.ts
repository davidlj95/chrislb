import ImagekitSdk from 'imagekit'
import ImageKit from 'imagekit'
import dotenv from 'dotenv'
import { Log } from '../utils/log'
import {
  FileObject,
  FolderObject,
  ImageKitOptions,
} from 'imagekit/dist/libs/interfaces'
import { ImageAsset } from '../../../src/app/common/images/image-asset'
import { ImageCdnApi, UNPUBLISHED_TAG } from './image-cdn-api'
import { URLSearchParams } from 'url'
import { isEmpty } from 'lodash-es'
import { URL } from '../../../src/app/common/images/cdn/imagekit'

export class Imagekit implements ImageCdnApi {
  private readonly _sdk: ImagekitSdk

  constructor(sdkOptions: ImageKitOptions) {
    this._sdk = new ImageKit(sdkOptions)
  }

  static fromEnv(): Imagekit {
    dotenv.config()

    const { IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY } = process.env
    if (!IMAGEKIT_PUBLIC_KEY || !IMAGEKIT_PRIVATE_KEY) {
      Log.error('Either ImageKit public key or private key is missing')
      Log.item(
        'Add them as environment variables or to a .env file and try again',
      )
      process.exit(1)
    }

    return new Imagekit({
      urlEndpoint: URL,
      publicKey: IMAGEKIT_PUBLIC_KEY,
      privateKey: IMAGEKIT_PRIVATE_KEY,
    })
  }

  async getAllImagesInPath(path: string): Promise<readonly ImageAsset[]> {
    const searchQuery = `tags NOT IN ${JSON.stringify([UNPUBLISHED_TAG])}`
    const response = await this._sdk.listFiles({
      searchQuery,
      path,
      fileType: 'image',
      includeFolder: false,
      sort: 'ASC_NAME',
    })
    const images = response
      .filter(isFileObject)
      .map(this._imageAssetFromFileObject)
    Log.info('Found %d images in path "%s"', images.length, path)
    return images
  }

  private _imageAssetFromFileObject(fileObject: FileObject): ImageAsset {
    const alt = (fileObject.customMetadata as CustomMetadata)?.alt
    const altMetadata: Pick<ImageAsset, 'alt'> = {}
    // Avoid adding if empty string to save some space
    if (!isEmpty(alt?.trim())) {
      altMetadata.alt = alt
    }
    // Point to specific file version
    const queryParams = new URLSearchParams()
    queryParams.set(
      'updatedAt',
      new Date(fileObject.updatedAt).getTime().toString(),
    )
    return {
      filename:
        //👇 Needed as otherwise srcSet attribute doesn't work if URL has spaces
        fileObject.filePath.split('/').map(encodeURIComponent).join('/') +
        `?${queryParams.toString()}`,
      height: fileObject.height,
      width: fileObject.width,
      ...altMetadata,
    }
  }
}

const isFileObject = (
  fileOrFolderObject: FileObject | FolderObject,
): fileOrFolderObject is FileObject =>
  !(fileOrFolderObject as FolderObject).folderId

interface CustomMetadata {
  alt?: string
}
