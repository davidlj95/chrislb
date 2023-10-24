import { Inject, Injectable, InjectionToken } from '@angular/core'
import { ImageAsset } from '../../data/images/types'
import projectsLookbooks from '../../data/images/projects-lookbooks.json'
import { Observable, of } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class ProjectLookbooksService {
  constructor(
    @Inject(PROJECT_PREVIEW_IMAGES_JSON)
    private projectLookbooksJson: ProjectsLookbooksJson,
  ) {}

  bySlug(slug: string): Observable<ReadonlyArray<ReadonlyArray<ImageAsset>>> {
    if (!this.projectSlugExists(slug)) {
      console.warn("No lookbooks found for project slug '%s'", slug)
      return of([])
    }
    return of(this.projectLookbooksJson[slug])
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
