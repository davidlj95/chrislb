import { Resource } from './resource'
import { basename, join } from 'path'
import { readdir } from 'fs/promises'
import { appendJsonExtension, JSON_EXTENSION, writeJson } from './json'

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

  async upsertResource(name: string, data: unknown): Promise<Resource> {
    const filename = appendJsonExtension(name)
    await writeJson(join(this.path, appendJsonExtension(name)), data)
    return new Resource(this, filename)
  }
}
