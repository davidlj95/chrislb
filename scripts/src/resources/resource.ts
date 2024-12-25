import { ResourceCollection } from './resource-collection'
import { join } from 'path'

export class Resource {
  constructor(
    readonly collection: ResourceCollection,
    readonly filename: string,
  ) {}

  get path(): string {
    return join(this.collection.path, this.filename)
  }

  get relativePath(): string {
    return join(this.collection.name, this.slug)
  }

  get slug(): string {
    return this.collection.fileType.removeExtension(this.filename)
  }

  async getData(): Promise<unknown> {
    return new this.collection.fileType.reader(this.path).read()
  }

  get childCollection(): ResourceCollection {
    return new ResourceCollection(join(this.collection.path, this.slug))
  }
}
