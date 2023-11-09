import { Resource } from './resource.mts'
import { basename, join } from 'path'
import { DataType } from './data-type.mts'
import { JSON_DATA_TYPE } from './json-data-type.mts'
import { mkdirSync, readdirSync } from 'fs'

export class ResourceCollection {
  private _resources?: ReadonlyArray<Resource>

  constructor(
    public readonly path: string,
    public readonly dataType: DataType = JSON_DATA_TYPE,
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
          dirent.isFile() && dirent.name.endsWith(this.dataType.extension),
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
    const filename = this.dataType.appendExtension(name)
    await new this.dataType.writer(join(this.path, filename)).write(data)
    return new Resource(this, filename)
  }

  public async upsertResource(name: string, data: unknown): Promise<Resource> {
    const filename = this.dataType.appendExtension(name)
    await new this.dataType.writer(join(this.path, filename)).write(data)
    return new Resource(this, filename)
  }

  private async createDirectoryIfDoesNotExist(): Promise<void> {
    mkdirSync(this.path, { recursive: true })
  }
}
