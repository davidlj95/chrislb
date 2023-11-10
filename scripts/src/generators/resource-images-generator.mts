import { Resource } from '../resources/resource.mts'
import { ImageCdnApi } from '../images/image-cdn-api.mts'
import { IMAGES_FILE_BASENAME } from '../../../src/app/common/files.ts'

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
