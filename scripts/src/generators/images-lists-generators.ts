import { ImageCdnApi } from '../images/image-cdn-api'
import { isMain } from '../utils/is-main'
import { Imagekit } from '../images/imagekit'
import { Log } from '../utils/log'
import { MiscImages } from '../../../src/app/common/images/misc-images'
import { IMAGES_FILE_BASENAME } from '../../../src/app/common/files'
import { Collections } from './collections'

export class ImagesListsGenerators {
  constructor(private readonly _imageCdnApi: ImageCdnApi) {}

  static fromEnv() {
    const imagekit = Imagekit.fromEnv('unpublished')
    return new this(imagekit)
  }

  async all(): Promise<void> {
    await this.miscImages()
  }

  async miscImages() {
    Log.info('Looking for misc images')
    const images = await this._imageCdnApi.getAllImagesInPath('misc')
    const horizontalLogo = images.find((image) =>
      image.name.includes('horizontal'),
    )
    const aboutPortrait = images.find((image) =>
      image.name.includes('portrait'),
    )
    if (!horizontalLogo) {
      throw new Error('Unable to find horizontal logo')
    }
    if (!aboutPortrait) {
      throw new Error('Unable to find about portrait')
    }
    const miscImages: MiscImages = {
      horizontalLogo,
      aboutPortrait,
    }
    await Collections.misc.upsertResource(IMAGES_FILE_BASENAME, miscImages)
  }
}

if (isMain(import.meta.url)) {
  await ImagesListsGenerators.fromEnv().all()

  Log.ok('All done')
}
