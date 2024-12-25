import { Resource } from '../resources/resource'
import { ImageCdnApi } from '../images/image-cdn-api'
import { IMAGES_FILE_BASENAME } from '../../../src/app/common/files'

export class ResourceImagesGenerator {
  constructor(readonly imageCdnApi: ImageCdnApi) {}

  async generate(resource: Resource): Promise<void> {
    const images = await this.imageCdnApi.getAllImagesInPath(
      this.getImageCdnPath(resource),
      true,
    )
    await resource.childCollection.createResource(this.basename, images)
  }

  getImageCdnPath(resource: Resource): string {
    return resource.relativePath
  }

  get basename() {
    return IMAGES_FILE_BASENAME
  }
}
