import { Resource } from './resource'
import { basename, join } from 'path'
import { FileType, JsonFileType } from './file'
import { mkdir, readdir } from 'fs/promises'

export class ResourceCollection {
  private _resources?: readonly Resource[]

  constructor(
    readonly path: string,
    readonly fileType: FileType = new JsonFileType(),
  ) {}

  get name(): string {
    return basename(this.path)
  }

  async getResources(): Promise<readonly Resource[]> {
    if (!this._resources) {
      const directoryFiles = await readdir(this.path, {
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
    await this.fileType.write(join(this.path, filename), data)
    return new Resource(this, filename)
  }

  async upsertResource(name: string, data: unknown): Promise<Resource> {
    const filename = this.fileType.appendExtension(name)
    await this.fileType.write(join(this.path, filename), data)
    return new Resource(this, filename)
  }

  private async _createDirectoryIfDoesNotExist(): Promise<void> {
    await mkdir(this.path, { recursive: true })
  }
}
