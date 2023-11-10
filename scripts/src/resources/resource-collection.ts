import { Resource } from './resource'
import { basename, join } from 'path'
import { FileType } from '../files/file-type'
import { JSON_FILE_TYPE } from '../files/json-file-type'
import { mkdirSync, readdirSync } from 'fs'

export class ResourceCollection {
  private _resources?: ReadonlyArray<Resource>

  constructor(
    public readonly path: string,
    public readonly fileType: FileType = JSON_FILE_TYPE,
  ) {}

  public get name(): string {
    return basename(this.path)
  }

  public async getResources(): Promise<ReadonlyArray<Resource>> {
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

  public async getResource(slug: string): Promise<Resource | undefined> {
    const resources = await this.getResources()
    return resources.find((resource) => resource.slug === slug)
  }

  public async createResource(name: string, data: unknown): Promise<Resource> {
    await this.createDirectoryIfDoesNotExist()
    const filename = this.fileType.appendExtension(name)
    await new this.fileType.writer(join(this.path, filename)).write(data)
    return new Resource(this, filename)
  }

  public async upsertResource(name: string, data: unknown): Promise<Resource> {
    const filename = this.fileType.appendExtension(name)
    await new this.fileType.writer(join(this.path, filename)).write(data)
    return new Resource(this, filename)
  }

  private async createDirectoryIfDoesNotExist(): Promise<void> {
    mkdirSync(this.path, { recursive: true })
  }
}
