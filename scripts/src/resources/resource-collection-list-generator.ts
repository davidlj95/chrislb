import { ResourceCollection } from './resource-collection'
import { join } from 'path'
import { Resource } from './resource'
import { Log } from '../utils/log'
import { isEmpty } from 'lodash-es'
import { appendJsonExtension, writeJson } from './json'

export class ResourceCollectionListGenerator {
  constructor(
    readonly resourceCollection: ResourceCollection,
    readonly listItemExtraDataGenerator?: ListItemExtraDataGenerator,
  ) {}

  get filename(): string {
    return appendJsonExtension(this.resourceCollection.name)
  }

  get filepath(): string {
    return join(this.resourceCollection.path, '..', this.filename)
  }

  async generate(): Promise<void> {
    Log.group('Generating list for %s collection', this.resourceCollection.name)
    const resources = await this.resourceCollection.getResources()
    Log.info('Found %d resources to include in list', resources.length)
    const resourcesData: unknown[] = []
    for (const resource of resources) {
      resourcesData.push(await this._generateResourceData(resource))
    }
    Log.info('Writing list as %s', this.filename)
    await writeJson(this.filepath, resourcesData)
    Log.ok('Done')
    Log.groupEnd()
  }

  async _generateResourceData(resource: Resource): Promise<unknown> {
    Log.group('Reading resource %s', resource.slug)
    const resourceData = await resource.read()
    if (this.listItemExtraDataGenerator) {
      Log.info('Generating and appending extra data')
      const listItemExtraData = await this.listItemExtraDataGenerator(resource)
      if (isEmpty(listItemExtraData)) {
        Log.warn('No extra data generated')
      }
      // Small trick given I know resource data is JSON
      Object.assign(resourceData as object, listItemExtraData)
    }
    Log.groupEnd()
    return resourceData
  }
}

type ListItemExtraDataGenerator = (
  resource: Resource,
) => Promise<object | undefined>
