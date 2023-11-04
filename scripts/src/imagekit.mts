import ImagekitSdk from 'imagekit'
import ImageKit from 'imagekit'
import dotenv from 'dotenv'
import { Log } from './log.mjs'
import imagesCdnConfigPkg from '../../src/app/common/images/cdn-config.js'
import { FileObject } from 'imagekit/dist/libs/interfaces'
import { ImageAsset } from '../../src/app/common/images/types.js'
import { ImageCdnApi } from './image-cdn-api.mjs'

const { IMAGEKIT_URL } = imagesCdnConfigPkg

export class Imagekit implements ImageCdnApi {
  private sdk: ImagekitSdk

  constructor(url: URL, publicKey: string, privateKey: string) {
    this.sdk = new ImageKit({
      urlEndpoint: url.toString(),
      publicKey,
      privateKey,
    })
  }

  public static fromEnv(): Imagekit {
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
      new URL(IMAGEKIT_URL),
      IMAGEKIT_PUBLIC_KEY,
      IMAGEKIT_PRIVATE_KEY,
    )
  }

  async getAllImagesInPath(
    path: string,
    includeSubdirectories: boolean = false,
  ): Promise<ReadonlyArray<ImageAsset>> {
    Log.group('Searching for images inside "%s" path', path)
    const imageAssets = await this.listImageAssetsInPath(path)
    imageAssets.length > 0
      ? Log.info('Found %d images', imageAssets.length)
      : Log.info('No images found')
    const imagesFromDirectories: ImageAsset[] = []
    if (includeSubdirectories) {
      const directoryNames = await this.listDirectoryNamesInPath(path)
      if (directoryNames.length > 0) {
        Log.info('Found %d directories', directoryNames.length)
        Log.info('Scanning directories...')
      } else {
        Log.info('No directories found')
      }
      Log.groupEnd()
      for (const directoryName of directoryNames) {
        imagesFromDirectories.push(
          ...(await this.getAllImagesInPath(`${path}/${directoryName}`)),
        )
      }
    }
    return [...imageAssets, ...imagesFromDirectories]
  }

  private async listImageAssetsInPath(
    path: string,
  ): Promise<ReadonlyArray<ImageAsset>> {
    const fileObjects = await this.sdk.listFiles({
      path,
      fileType: 'image',
      includeFolder: false,
      sort: 'ASC_NAME',
    })
    return fileObjects.map(this.imageAssetFromFileObject)
  }

  private async listDirectoryNamesInPath(
    path: string,
  ): Promise<ReadonlyArray<string>> {
    const response = await this.sdk.listFiles({
      path,
      type: 'folder',
    })
    const folderObjects = response as unknown as ReadonlyArray<FolderObject>
    return folderObjects.map((folderObject) => folderObject.name)
  }

  private imageAssetFromFileObject(fileObject: FileObject): ImageAsset {
    const alt = (fileObject.customMetadata as CustomMetadata)?.alt
    const altMetadata: Pick<ImageAsset, 'alt'> = {}
    // Avoid adding if empty string to save some space
    if (!!alt && alt.length > 0) {
      altMetadata.alt = alt
    }
    return {
      name: fileObject.name,
      //👇 Needed as otherwise srcSet attribute doesn't work if URL has spaces
      filePath: fileObject.filePath
        .split('/')
        .map(encodeURIComponent)
        .join('/'),
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

type CustomMetadata = {
  alt?: string
}