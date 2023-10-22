import { Inject, Injectable, InjectionToken } from '@angular/core'
import { ImageAsset } from '../../../data/images/types'
import projectPreviewImages from '../../../data/images/projects-preview.json'

@Injectable({
  providedIn: 'root',
})
export class ProjectPreviewImagesService {
  constructor(
    @Inject(PROJECT_PREVIEW_IMAGES_JSON)
    private projectsPreviewImagesJson: JsonProjectsPreviewImages,
  ) {}

  async byId(id: string): Promise<ReadonlyArray<ImageAsset>> {
    if (!this.projectIdExists(id)) {
      console.warn("No preview images found for project id '%s'", id)
      return []
    }
    return this.projectsPreviewImagesJson[id]
  }

  projectIdExists(id: string): id is ProjectId {
    return Object.keys(this.projectsPreviewImagesJson).includes(id)
  }
}

const PROJECT_PREVIEW_IMAGES_JSON =
  new InjectionToken<JsonProjectsPreviewImages>('Project preview images JSON', {
    factory: () => projectPreviewImages,
  })
type JsonProjectsPreviewImages = typeof projectPreviewImages
type ProjectId = keyof JsonProjectsPreviewImages
