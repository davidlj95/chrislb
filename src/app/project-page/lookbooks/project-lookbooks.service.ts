import { Inject, Injectable, InjectionToken } from '@angular/core'
import projectsLookbooks from '../../../data/images/projects-lookbooks.json'
import { Observable, of } from 'rxjs'
import { Lookbook } from './lookbook/lookbook'
import { ProjectLookbookNamesService } from './project-lookbook-names.service'
import {
  LookbookImagesBySlug,
  LookbooksByProjectSlug,
} from '../../../data/images/types'

@Injectable({
  providedIn: 'root',
})
export class ProjectLookbooksService {
  constructor(
    @Inject(LOOKBOOKS_BY_PROJECT_SLUG)
    private lookbooksByProjectSlug: LookbooksByProjectSlug,
    private projectLookbookNamesService: ProjectLookbookNamesService,
  ) {}

  bySlug(projectSlug: string): Observable<ReadonlyArray<Lookbook>> {
    const lookbooks = this.getLookbooks(projectSlug)
    if (!lookbooks) {
      return of()
    }
    return of(
      Object.entries(lookbooks).map(([lookbookSlug, images]) => ({
        slug: lookbookSlug,
        images,
        name: this.projectLookbookNamesService.bySlug(lookbookSlug),
      })),
    )
  }

  private getLookbooks(projectSlug: string): LookbookImagesBySlug | undefined {
    return this.lookbooksByProjectSlug[projectSlug]
  }
}

const LOOKBOOKS_BY_PROJECT_SLUG = new InjectionToken<LookbooksByProjectSlug>(
  'Lookbooks by project slug',
  {
    factory: () => projectsLookbooks,
  },
)
