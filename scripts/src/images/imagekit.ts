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
import { ImageCdnApi } from './image-cdn-api'
import { URLSearchParams } from 'url'
import { isEmpty } from 'lodash-es'
import { IMAGEKIT_URL } from '../../../src/app/common/images/cdn-config'

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

    return new this({
      urlEndpoint: new URL(IMAGEKIT_URL).toString(),
      publicKey: IMAGEKIT_PUBLIC_KEY,
      privateKey: IMAGEKIT_PRIVATE_KEY,
    })
  }

  async getAllImagesInPath(path: string): Promise<readonly ImageAsset[]> {
    Log.group('Searching for images inside "%s" path', path)
    const imageAssets = await this._listImageAssetsInPath(path)
    if (isEmpty(imageAssets)) {
      Log.info('No images found')
    } else {
      Log.info('Found %d images', imageAssets.length)
    }
    const imagesFromDirectories: ImageAsset[] = []
    Log.groupEnd()
    return [...imageAssets, ...imagesFromDirectories]
  }

  private async _listImageAssetsInPath(
    path: string,
  ): Promise<readonly ImageAsset[]> {
    const searchQuery = `tags NOT IN ${JSON.stringify([UNPUBLISHED_TAG])}`
    const fileObjects = await this._sdk.listFiles({
      searchQuery,
      path,
      fileType: 'image',
      includeFolder: false,
      sort: 'ASC_NAME',
    })
    return fileObjects.filter(isFileObject).map(this._imageAssetFromFileObject)
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
      name: fileObject.name,
      //👇 Needed as otherwise srcSet attribute doesn't work if URL has spaces
      filePath:
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

const UNPUBLISHED_TAG = 'unpublished'
