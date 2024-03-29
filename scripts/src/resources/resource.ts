import { ResourceCollection } from './resource-collection'
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
    return this.collection.fileType.removeExtension(this.filename)
  }

  public async getData(): Promise<unknown> {
    return new this.collection.fileType.reader(this.path).read()
  }

  public get childCollection(): ResourceCollection {
    return new ResourceCollection(join(this.collection.path, this.slug))
  }
}
