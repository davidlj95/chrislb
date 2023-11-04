import { ResourceCollection } from './resource-collection.mjs'
import { join } from 'path'

export class Resource {
  constructor(
    public readonly collection: ResourceCollection,
    public readonly filename: string,
  ) {}

  public get path(): string {
    return join(this.collection.path, this.filename)
  }

  public get relativePath(): string {
    return join(this.collection.name, this.slug)
  }

  public get slug(): string {
    return this.collection.dataType.removeExtension(this.filename)
  }

  public async getData(): Promise<unknown> {
    return new this.collection.dataType.reader(this.path).read()
  }

  public get childCollection(): ResourceCollection {
    return new ResourceCollection(join(this.collection.path, this.slug))
  }
}
