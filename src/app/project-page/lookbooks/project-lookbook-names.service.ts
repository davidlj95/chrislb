import { Inject, Injectable, InjectionToken } from '@angular/core'
import lookbookNameBySlug from '../../../data/loobook-name-by-slug.json'

@Injectable({
  providedIn: 'root',
})
export class ProjectLookbookNamesService {
  constructor(
    @Inject(LOOKBOOK_NAME_BY_SLUG)
    private lookbookNameBySlug: LookbookNameBySlug,
  ) {}

  public bySlug(slug: string): string | undefined {
    return this.lookbookNameBySlug[slug]
  }
}

const LOOKBOOK_NAME_BY_SLUG = new InjectionToken<LookbookNameBySlug>(
  'Loobook name by slug',
  {
    factory: () => lookbookNameBySlug,
  },
)

interface LookbookNameBySlug {
  [slug: string]: string | undefined
}
