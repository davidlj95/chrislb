import { isMain } from './is-main.mjs'
import { Log } from './log.mjs'
import { getRepositoryRootDir } from './get-repository-root-dir.mjs'
import { join } from 'path'
import directoriesPkg from '../../src/app/common/directories.js'
import { Imagekit } from './imagekit.mjs'
import { ResourceCollection } from './resource-collection.mjs'
import { ResourceImagesGenerator } from './resource-images-generator.mjs'
import { ImageCdnApi } from './image-cdn-api.mjs'
import { ResourceCollectionListGenerator } from './resource-collection-list-generator.mjs'
import { ProjectListItemExtraDataGenerator } from './project-list-item-extra-data-generator.mjs'
import { Resource } from './resource.mjs'
import { MiscImages } from '../../src/app/common/images/types.js'

const { DATA_DIR, CONTENTS_DIR, PROJECTS_DIR } = directoriesPkg

class Generators {
  private readonly REPO_PATH = getRepositoryRootDir()
  private readonly SRC_PATH = join(this.REPO_PATH, 'src')
  private readonly DATA_PATH = join(this.SRC_PATH, DATA_DIR)
  private readonly CONTENT_PATH = join(this.SRC_PATH, CONTENTS_DIR)
  private readonly IMAGES_DIR = 'images'
  private readonly resourceImagesGenerator = new ResourceImagesGenerator(
    this.imageCdnApi,
  )

  constructor(private readonly imageCdnApi: ImageCdnApi) {}

  private get projects(): ResourceCollection {
    return new ResourceCollection(join(this.CONTENT_PATH, PROJECTS_DIR))
  }

  private get images(): ResourceCollection {
    return new ResourceCollection(join(this.DATA_PATH, this.IMAGES_DIR))
  }

  public async all() {
    await this.miscImages()
    await this.projectsImages()
    await this.projectsList()
    await this.authorsList()
  }

  public async miscImages() {
    Log.info('Looking for misc images')
    const miscPathAndFilename = 'misc'
    const misc = await this.imageCdnApi.getAllImagesInPath(miscPathAndFilename)
    const horizontalLogo = misc.find((image) =>
      image.name.includes('horizontal'),
    )
    const aboutPortrait = misc.find((image) => image.name.includes('portrait'))
    if (!horizontalLogo) {
      throw new Error('Unable to find horizontal logo')
    }
    if (!aboutPortrait) {
      throw new Error('Unable to find about portrait')
    }
    const miscJson: MiscImages = {
      horizontalLogo,
      aboutPortrait,
    }
    await this.images.upsertResource(miscPathAndFilename, miscJson)
  }

  public async projectsImages() {
    for (const project of await this.projects.getResources()) {
      await this.resourceImagesGenerator.generate(project)
    }
  }

  public async projectsList(): Promise<void> {
    return new ResourceCollectionListGenerator(this.projects, (resource) =>
      new ProjectListItemExtraDataGenerator(
        resource,
        this.resourceImagesGenerator,
      ).generate(),
    ).generate()
  }

  public async authorsList(): Promise<void> {
    return new ResourceCollectionListGenerator(
      new ResourceCollection(join(this.DATA_PATH, 'authors')),
      async (resource: Resource) => {
        return { slug: resource.slug }
      },
    ).generate()
  }
}

if (isMain(import.meta.url)) {
  const imagekit = Imagekit.fromEnv()
  await new Generators(imagekit).all()

  Log.ok('All done')
}