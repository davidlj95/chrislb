import { ResourceCollection } from './resource-collection'
import { join } from 'path'
import { readJson, removeJsonExtension } from './json'

export class Resource {
  constructor(
    readonly collection: ResourceCollection,
    readonly filename: string,
  ) {}

  get path(): string {
    return join(this.collection.path, this.filename)
  }

  get slug(): string {
    return removeJsonExtension(this.filename)
  }

  async read(): Promise<unknown> {
    return readJson(this.path)
  }
}
