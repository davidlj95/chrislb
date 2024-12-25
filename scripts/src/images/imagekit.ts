import ImagekitSdk from 'imagekit'
import ImageKit from 'imagekit'
import dotenv from 'dotenv'
import { Log } from '../utils/log'
import { FileObject, ImageKitOptions } from 'imagekit/dist/libs/interfaces'
import { ImageAsset } from '../../../src/app/common/images/image-asset'
import { ImageCdnApi } from './image-cdn-api'
import { URLSearchParams } from 'url'
import { isEmpty } from 'lodash-es'
import { IMAGEKIT_URL } from '../../../src/app/common/images/cdn-config'

export class Imagekit implements ImageCdnApi {
  private readonly _sdk: ImagekitSdk

  constructor(
    sdkOptions: ImageKitOptions,
    readonly unpublishedTag?: string,
  ) {
    this._sdk = new ImageKit(sdkOptions)
  }

  static fromEnv(
    ...otherInitOptions: RemoveFirst<ConstructorParameters<typeof Imagekit>>
  ): Imagekit {
    dotenv.config()

    const { IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY } = process.env
    if (!IMAGEKIT_PUBLIC_KEY || !IMAGEKIT_PRIVATE_KEY) {
      Log.error('Either ImageKit public key or private key is missing')
      Log.item(
        'Add them as environment variables or to a .env file and try again',
      )
      process.exit(1)
    }

    return new this(
      {
        urlEndpoint: new URL(IMAGEKIT_URL).toString(),
        publicKey: IMAGEKIT_PUBLIC_KEY,
        privateKey: IMAGEKIT_PRIVATE_KEY,
      },
      ...otherInitOptions,
    )
  }

  async getAllImagesInPath(
    path: string,
    includeSubdirectories = false,
  ): Promise<readonly ImageAsset[]> {
    Log.group('Searching for images inside "%s" path', path)
    const imageAssets = await this._listImageAssetsInPath(path)
    if (isEmpty(imageAssets)) {
      Log.info('No images found')
    } else {
      Log.info('Found %d images', imageAssets.length)
    }
    const imagesFromDirectories: ImageAsset[] = []
    if (includeSubdirectories) {
      const directoryNames = await this._listDirectoryNamesInPath(path)
      if (isEmpty(directoryNames)) {
        Log.info('No directories found')
      } else {
        Log.info('Found %d directories', directoryNames.length)
        Log.info('Scanning directories...')
      }
      Log.groupEnd()
      for (const directoryName of directoryNames) {
        imagesFromDirectories.push(
          ...(await this.getAllImagesInPath(
            `${path}/${directoryName}`,
            includeSubdirectories,
          )),
        )
      }
    } else {
      Log.groupEnd()
    }
    return [...imageAssets, ...imagesFromDirectories]
  }

  private async _listImageAssetsInPath(
    path: string,
  ): Promise<readonly ImageAsset[]> {
    const searchQuery = this.unpublishedTag
      ? `tags NOT IN ${JSON.stringify([this.unpublishedTag])}`
      : undefined
    const fileObjects = await this._sdk.listFiles({
      searchQuery,
      path,
      fileType: 'image',
      includeFolder: false,
      sort: 'ASC_NAME',
    })
    return fileObjects.map(this._imageAssetFromFileObject)
  }

  private async _listDirectoryNamesInPath(
    path: string,
  ): Promise<readonly string[]> {
    const response = await this._sdk.listFiles({
      path,
      type: 'folder',
    })
    const folderObjects = response as unknown as readonly FolderObject[]
    return folderObjects.map((folderObject) => folderObject.name)
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

type FolderObject = Pick<
  FileObject,
  'type' | 'name' | 'createdAt' | 'updatedAt'
> & {
  folderId: string
  folderPath: string
}

interface CustomMetadata {
  alt?: string
}

type RemoveFirst<T extends unknown[]> = T extends [unknown, ...infer R] ? R : T
