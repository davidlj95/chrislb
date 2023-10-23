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

  async bySlug(slug: string): Promise<ReadonlyArray<ImageAsset>> {
    if (!this.projectSlugExists(slug)) {
      console.warn("No preview images found for project slug '%s'", slug)
      return []
    }
    return this.projectsPreviewImagesJson[slug]
  }

  projectSlugExists(slug: string): slug is ProjectSlug {
    return Object.keys(this.projectsPreviewImagesJson).includes(slug)
  }
}

const PROJECT_PREVIEW_IMAGES_JSON =
  new InjectionToken<JsonProjectsPreviewImages>('Project preview images JSON', {
    factory: () => projectPreviewImages,
  })
type JsonProjectsPreviewImages = typeof projectPreviewImages
type ProjectSlug = keyof JsonProjectsPreviewImages
