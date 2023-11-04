import { ResourceCollection } from './resource-collection.mjs'
import { join } from 'path'
import { Resource } from './resource.mjs'
import { Log } from './log.mjs'

export class ResourceCollectionListGenerator {
  constructor(
    public readonly resourceCollection: ResourceCollection,
    public readonly listItemExtraDataGenerator?: ListItemExtraDataGenerator,
  ) {}

  public get filename(): string {
    return this.resourceCollection.dataType.appendExtension(
      this.resourceCollection.name,
    )
  }

  public get filepath(): string {
    return join(this.resourceCollection.path, '..', this.filename)
  }

  public async generate(): Promise<void> {
    Log.group('Generating list for %s collection', this.resourceCollection.name)
    const resources = await this.resourceCollection.getResources()
    Log.info('Found %d resources to include in list', resources.length)
    const resourcesData: Array<unknown> = []
    for (const resource of resources) {
      resourcesData.push(await this.generateResourceData(resource))
    }
    Log.info('Writing list as %s', this.filename)
    const writer = new this.resourceCollection.dataType.writer(this.filepath)
    await writer.write(resourcesData)
    Log.ok('Done')
    Log.groupEnd()
  }

  private async generateResourceData(resource: Resource): Promise<unknown> {
    Log.group('Reading resource %s', resource.slug)
    const resourceData = await resource.getData()
    if (this.listItemExtraDataGenerator) {
      Log.info('Generating and appending extra data')
      const listItemExtraData = await this.listItemExtraDataGenerator(resource)
      if (!listItemExtraData || Object.keys(listItemExtraData).length === 0) {
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
