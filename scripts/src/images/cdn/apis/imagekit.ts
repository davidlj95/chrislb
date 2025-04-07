import ImagekitSdk from 'imagekit'
import ImageKit from 'imagekit'
import dotenv from 'dotenv'
import { Log } from '../../../utils/log'
import {
  FileObject,
  FolderObject,
  ImageKitOptions,
} from 'imagekit/dist/libs/interfaces'
import { Image } from '@/app/common/images/image'
import { ImageCdnApi, UNPUBLISHED_TAG } from '../image-cdn-api'
import { URLSearchParams } from 'url'
import { CLOUD_URL, urlForBreakpoint } from '@/app/common/images/cdn/imagekit'
import { getSignature } from 'imagekit/dist/libs/url/builder'

export class Imagekit implements ImageCdnApi {
  private readonly _sdk: ImagekitSdk

  constructor(sdkOptions: ImageKitOptions) {
    this._sdk = new ImageKit(sdkOptions)
  }

  static getInstance(): Imagekit {
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
      urlEndpoint: CLOUD_URL,
      publicKey: IMAGEKIT_PUBLIC_KEY,
      privateKey: IMAGEKIT_PRIVATE_KEY,
    })
  }

  async getAllImagesInPath(path: string): Promise<readonly Image[]> {
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

  private _imageAssetFromFileObject(fileObject: FileObject): Image {
    const alt = (fileObject.customMetadata as CustomMetadata)?.alt
    // Point to specific file version
    const queryParams = new URLSearchParams()
    queryParams.set(
      'updatedAt',
      new Date(fileObject.updatedAt).getTime().toString(),
    )
    return {
      src:
        //👇 Needed as otherwise srcSet attribute doesn't work if URL has spaces
        fileObject.filePath.split('/').map(encodeURIComponent).join('/') +
        `?${queryParams.toString()}`,
      height: fileObject.height,
      width: fileObject.width,
      ...(alt?.trim() ? { alt } : {}),
    }
  }

  async signImage(
    image: Image,
    breakpoint: number | undefined,
  ): Promise<string> {
    const url = urlForBreakpoint(image.src, breakpoint)
    // https://github.com/imagekit-developer/imagekit-nodejs/blob/6.0.0/libs/url/builder.ts#L169
    const { privateKey, urlEndpoint } = this._sdk.options
    return getSignature({
      privateKey,
      url,
      urlEndpoint,
      // 👇 To generate same signature as SDK
      // https://github.com/imagekit-developer/imagekit-nodejs/blob/6.0.0/libs/url/builder.ts#L98-L102
      expiryTimestamp: DEFAULT_TIMESTAMP,
    })
  }
}

const isFileObject = (
  fileOrFolderObject: FileObject | FolderObject,
): fileOrFolderObject is FileObject =>
  !(fileOrFolderObject as FolderObject).folderId

interface CustomMetadata {
  alt?: string
}

// https://github.com/imagekit-developer/imagekit-nodejs/blob/6.0.0/libs/url/builder.ts#L25
const DEFAULT_TIMESTAMP = '9999999999'
