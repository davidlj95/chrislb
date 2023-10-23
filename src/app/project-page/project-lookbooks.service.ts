import { Inject, Injectable, InjectionToken } from '@angular/core'
import { ImageAsset } from '../../data/images/types'
import projectsLookbooks from '../../data/images/projects-lookbooks.json'

@Injectable({
  providedIn: 'root',
})
export class ProjectLookbooksService {
  constructor(
    @Inject(PROJECT_PREVIEW_IMAGES_JSON)
    private projectLookbooksJson: ProjectsLookbooksJson,
  ) {}

  async bySlug(slug: string): Promise<ReadonlyArray<Lookbook>> {
    if (!this.projectSlugExists(slug)) {
      console.warn("No lookbooks found for project slug '%s'", slug)
      return []
    }
    return this.projectLookbooksJson[slug]
  }

  projectSlugExists(slug: string): slug is ProjectSlug {
    return Object.keys(this.projectLookbooksJson).includes(slug)
  }
}

const PROJECT_PREVIEW_IMAGES_JSON = new InjectionToken<ProjectsLookbooksJson>(
  'Projects lookbooks JSON',
  {
    factory: () => projectsLookbooks,
  },
)
type ProjectsLookbooksJson = typeof projectsLookbooks
type ProjectSlug = keyof ProjectsLookbooksJson
export type Lookbook = ReadonlyArray<ImageAsset>
