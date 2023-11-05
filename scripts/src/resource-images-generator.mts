import { Resource } from './resource.mjs'
import { ImageCdnApi } from './image-cdn-api.mjs'

export class ResourceImagesGenerator {
  constructor(public readonly imageCdnApi: ImageCdnApi) {}

  public async generate(resource: Resource): Promise<void> {
    const images = await this.imageCdnApi.getAllImagesInPath(
      this.getImageCdnPath(resource),
      true,
    )
    await resource.childCollection.createResource(this.basename, images)
  }

  public getImageCdnPath(resource: Resource): string {
    return resource.relativePath
  }

  public get basename() {
    return 'images'
  }
}
