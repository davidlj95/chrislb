import { Resource } from './resource'
import { basename, join } from 'path'
import { FileType } from '../files/file-type'
import { JSON_FILE_TYPE } from '../files/json-file-type'
import { mkdirSync, readdirSync } from 'fs'

export class ResourceCollection {
  private _resources?: readonly Resource[]

  constructor(
    readonly path: string,
    readonly fileType: FileType = JSON_FILE_TYPE,
  ) {}

  get name(): string {
    return basename(this.path)
  }

  async getResources(): Promise<readonly Resource[]> {
    if (!this._resources) {
      const directoryFiles = readdirSync(this.path, {
        withFileTypes: true,
      })
      const resourceFiles = directoryFiles.filter(
        (dirent) =>
          dirent.isFile() && dirent.name.endsWith(this.fileType.extension),
      )
      this._resources = resourceFiles.map(
        (resourceFile) => new Resource(this, resourceFile.name),
      )
    }
    return this._resources
  }

  async getResource(slug: string): Promise<Resource | undefined> {
    const resources = await this.getResources()
    return resources.find((resource) => resource.slug === slug)
  }

  async createResource(name: string, data: unknown): Promise<Resource> {
    await this._createDirectoryIfDoesNotExist()
    const filename = this.fileType.appendExtension(name)
    await new this.fileType.writer(join(this.path, filename)).write(data)
    return new Resource(this, filename)
  }

  async upsertResource(name: string, data: unknown): Promise<Resource> {
    const filename = this.fileType.appendExtension(name)
    await new this.fileType.writer(join(this.path, filename)).write(data)
    return new Resource(this, filename)
  }

  private async _createDirectoryIfDoesNotExist(): Promise<void> {
    mkdirSync(this.path, { recursive: true })
  }
}
