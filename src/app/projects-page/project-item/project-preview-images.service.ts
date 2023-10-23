import { Inject, Injectable, InjectionToken } from '@angular/core'
import { ImageAsset } from '../../../data/images/types'
import projectsPreviewImages from '../../../data/images/projects-preview.json'

@Injectable({
  providedIn: 'root',
})
export class ProjectPreviewImagesService {
  constructor(
    @Inject(PROJECTS_PREVIEW_IMAGES_JSON)
    private projectsPreviewImagesJson: ProjectsPreviewImagesJson,
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

const PROJECTS_PREVIEW_IMAGES_JSON =
  new InjectionToken<ProjectsPreviewImagesJson>(
    'Projects preview images JSON',
    {
      factory: () => projectsPreviewImages,
    },
  )
type ProjectsPreviewImagesJson = typeof projectsPreviewImages
type ProjectSlug = keyof ProjectsPreviewImagesJson
