import { ResourceImagesGenerator } from './resource-images-generator.mts'
import { ImageCdnApi } from '../images/image-cdn-api.mts'
import { isMain } from '../utils/is-main.mts'
import { Imagekit } from '../images/imagekit.mts'
import { Log } from '../utils/log.mts'
import { MiscImages } from '../../../src/app/common/images/misc-images.ts'
import { IMAGES_FILE_BASENAME } from '../../../src/app/common/files.ts'
import { Collections } from './collections.mts'

export class ImagesListsGenerators {
  private readonly resourceImagesGenerator: ResourceImagesGenerator
  private readonly collections: Collections

  constructor(private readonly imageCdnApi: ImageCdnApi) {
    this.resourceImagesGenerator = new ResourceImagesGenerator(imageCdnApi)
    this.collections = new Collections()
  }

  public static fromEnv() {
    const imagekit = Imagekit.fromEnv('unpublished')
    return new this(imagekit)
  }

  public async all(): Promise<void> {
    await this.miscImages()
    await this.projectsImages()
  }

  public async miscImages() {
    Log.info('Looking for misc images')
    const images = await this.imageCdnApi.getAllImagesInPath('misc')
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
    await this.collections.misc.upsertResource(IMAGES_FILE_BASENAME, miscImages)
  }

  public async projectsImages() {
    Log.info('Looking for project images')
    for (const project of await this.collections.projects.getResources()) {
      await this.resourceImagesGenerator.generate(project)
    }
  }
}

if (isMain(import.meta.url)) {
  await ImagesListsGenerators.fromEnv().all()

  Log.ok('All done')
}
