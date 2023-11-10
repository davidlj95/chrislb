import { ResourceCollectionListGenerator } from '../resources/resource-collection-list-generator.mts'
import { ProjectListItemExtraDataGenerator } from './project-list-item-extra-data-generator.mts'
import { Resource } from '../resources/resource.mts'
import { isMain } from '../utils/is-main.mts'
import { Log } from '../utils/log.mts'
import { Collections } from './collections.mts'
import { IMAGES_FILE_BASENAME } from '../../../src/app/common/files.ts'

export class ContentGenerators {
  public readonly collections: Collections

  constructor() {
    this.collections = new Collections()
  }

  public async all() {
    await this.projectsList()
    await this.authorsList()
    await this.assetsCollectionsList()
  }

  public async projectsList(): Promise<void> {
    return new ResourceCollectionListGenerator(
      this.collections.projects,
      (resource) =>
        new ProjectListItemExtraDataGenerator(
          resource,
          IMAGES_FILE_BASENAME,
        ).generate(),
    ).generate()
  }

  public async authorsList(): Promise<void> {
    return new ResourceCollectionListGenerator(
      this.collections.authors,
      async (resource: Resource) => {
        return { slug: resource.slug }
      },
    ).generate()
  }

  public async assetsCollectionsList(): Promise<void> {
    return new ResourceCollectionListGenerator(
      this.collections.assetsCollections,
    ).generate()
  }
}

if (isMain(import.meta.url)) {
  await new ContentGenerators().all()

  Log.ok('All done')
}
