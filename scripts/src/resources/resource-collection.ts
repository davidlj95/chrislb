import { Resource } from './resource'
import { basename } from 'path'
import { readdir } from 'fs/promises'
import { JSON_EXTENSION } from './json'

export class ResourceCollection {
  private _resources?: readonly Resource[]

  constructor(readonly path: string) {}

  get name(): string {
    return basename(this.path)
  }

  async getResources(): Promise<readonly Resource[]> {
    if (!this._resources) {
      const directoryFiles = await readdir(this.path, {
        withFileTypes: true,
      })
      const resourceFiles = directoryFiles.filter(
        (dirent) => dirent.isFile() && dirent.name.endsWith(JSON_EXTENSION),
      )
      this._resources = resourceFiles.map(
        (resourceFile) => new Resource(this, resourceFile.name),
      )
    }
    return this._resources
  }
}
