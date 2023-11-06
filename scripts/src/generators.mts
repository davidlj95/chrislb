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
import { MiscImages } from '../../src/app/common/images/misc-images.js'
import { RoutesFileGenerator } from './routes-file-generator.mjs'
import filesPkg from '../../src/app/common/files.js'

const { IMAGES_FILE_BASENAME } = filesPkg
const { DATA_DIR, CONTENTS_DIR, PROJECTS_DIR } = directoriesPkg

class Generators {
  private readonly REPO_PATH = getRepositoryRootDir()
  private readonly SRC_PATH = join(this.REPO_PATH, 'src')
  private readonly DATA_PATH = join(this.SRC_PATH, DATA_DIR)
  private readonly CONTENT_PATH = join(this.SRC_PATH, CONTENTS_DIR)
  private readonly MISC_DIR = 'misc'
  private readonly resourceImagesGenerator = new ResourceImagesGenerator(
    this.imageCdnApi,
  )

  constructor(private readonly imageCdnApi: ImageCdnApi) {}

  private get projects(): ResourceCollection {
    return new ResourceCollection(join(this.CONTENT_PATH, PROJECTS_DIR))
  }

  private get misc(): ResourceCollection {
    return new ResourceCollection(join(this.DATA_PATH, this.MISC_DIR))
  }

  public async all() {
    await this.miscImages()
    await this.projectsImages()
    await this.projectsList()
    await this.authorsList()
    await this.assetsCollectionsList()
    await this.routesFile()
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
    await this.misc.upsertResource(IMAGES_FILE_BASENAME, miscImages)
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

  public async assetsCollectionsList(): Promise<void> {
    return new ResourceCollectionListGenerator(
      new ResourceCollection(join(this.DATA_PATH, 'assets-collections')),
    ).generate()
  }

  public async routesFile(): Promise<void> {
    return new RoutesFileGenerator().all()
  }
}

if (isMain(import.meta.url)) {
  const imagekit = Imagekit.fromEnv('unpublished')
  await new Generators(imagekit).all()

  Log.ok('All done')
}
