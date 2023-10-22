import { Inject, Injectable, InjectionToken } from '@angular/core'
import { ImageAsset } from '../../../../data/images'
import images from '../../../../data/images.json'

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  constructor(@Inject(IMAGES_JSON) private imagesJson: JsonImages) {}

  async getPreviewImages(id: string): Promise<ReadonlyArray<ImageAsset>> {
    if (!this.isImageProjectId(id)) {
      console.warn("No preview images found for project id '%s'", id)
      return []
    }
    return this.imagesJson.projects[id]?.preview
  }

  isImageProjectId(id: string): id is ImageProjectIds {
    return Object.keys(this.imagesJson.projects).includes(id)
  }
}

const IMAGES_JSON = new InjectionToken<JsonImages>('Images JSON', {
  factory: () => images,
})
type JsonImages = typeof images
type ImageProjectIds = keyof typeof images.projects
