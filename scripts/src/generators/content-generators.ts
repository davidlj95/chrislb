import { ResourceCollectionListGenerator } from '../resources/resource-collection-list-generator'
import { Resource } from '../resources/resource'
import { isMain } from '../utils/is-main'
import { Log } from '../utils/log'
import { Collections } from './collections'

export class ContentGenerators {
  async all() {
    await this.authorsList()
    await this.assetsCollectionsList()
  }

  async authorsList(): Promise<void> {
    return new ResourceCollectionListGenerator(
      Collections.authors,
      async (resource: Resource) => {
        return { slug: resource.slug }
      },
    ).generate()
  }

  async assetsCollectionsList(): Promise<void> {
    return new ResourceCollectionListGenerator(
      Collections.assetsCollections,
    ).generate()
  }
}

if (isMain(import.meta.url)) {
  await new ContentGenerators().all()

  Log.ok('All done')
}
