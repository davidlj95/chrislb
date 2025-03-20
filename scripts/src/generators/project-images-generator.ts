import { Resource } from '../resources/resource'
import { ImageCdnApi } from '../images/image-cdn-api'
import { IMAGES_FILE_BASENAME } from '../../../src/app/common/files'

export class ProjectImagesGenerator {
  constructor(readonly imageCdnApi: ImageCdnApi) {}

  async generate(dataProject: Resource): Promise<void> {}

  getImageCdnPath(resource: Resource): string {
    return resource.relativePath
  }

  get basename() {
    return IMAGES_FILE_BASENAME
  }
}
