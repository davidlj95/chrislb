import { Resource } from './resource.mjs'
import { ImageCdnApi } from './image-cdn-api.mjs'
import filesPkg from '../../src/app/common/files.js'

const { IMAGES_FILE_BASENAME } = filesPkg

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
    return IMAGES_FILE_BASENAME
  }
}
