import { Inject, Injectable, InjectionToken } from '@angular/core'
import projectsDesignBooks from '../../../data/images/projects-design-books.json'
import { Observable, of } from 'rxjs'
import { ImageAsset, ImageAssetsBySlug } from '../../../data/images/types'

@Injectable({
  providedIn: 'root',
})
export class ProjectDesignBookService {
  constructor(
    @Inject(DESIGN_BOOK_BY_SLUG)
    private designBookBySlug: ImageAssetsBySlug,
  ) {}

  bySlug(projectSlug: string): Observable<ReadonlyArray<ImageAsset>> {
    return of(this.designBookBySlug[projectSlug] ?? [])
  }
}

const DESIGN_BOOK_BY_SLUG = new InjectionToken<ImageAssetsBySlug>(
  'Design book by project slug',
  {
    factory: () => projectsDesignBooks,
  },
)
