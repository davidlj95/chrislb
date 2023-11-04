import { Injectable } from '@angular/core'
import { Lookbook } from './lookbook'
import { JsonFetcher } from '../../common/json-fetcher/json-fetcher'
import { PROJECTS_DIR } from '../../common/directories'
import { LOOKBOOKS_IMAGES_FILENAME } from '../../common/files'
import { from, map, Observable } from 'rxjs'
import { LookbookNameAndSlug } from '../lookbook-name-and-slug'

@Injectable({
  providedIn: 'root',
})
export class ProjectLookbooksService {
  constructor(private jsonFetcher: JsonFetcher) {}

  bySlug(
    projectSlug: string,
    lookbookNamesAndSlugs: ReadonlyArray<LookbookNameAndSlug> = [],
  ): Observable<ReadonlyArray<Lookbook>> {
    return from(
      this.jsonFetcher.fetch<ReadonlyArray<Lookbook>>(
        PROJECTS_DIR,
        projectSlug,
        LOOKBOOKS_IMAGES_FILENAME,
      ),
    ).pipe(
      map((unsortedLookbooksWithoutNames) => {
        const lookbooksBySlug = new Map(
          unsortedLookbooksWithoutNames.map((lookbook) => [
            lookbook.slug,
            lookbook,
          ]),
        )
        const lookbooks: Lookbook[] = []
        for (const lookbookNameAndSlug of lookbookNamesAndSlugs) {
          const lookbook = lookbooksBySlug.get(lookbookNameAndSlug.slug)
          if (lookbook) {
            lookbooks.push({ ...lookbook, name: lookbookNameAndSlug.name })
            lookbooksBySlug.delete(lookbookNameAndSlug.slug)
          }
        }
        return [...lookbooks, ...lookbooksBySlug.values()]
      }),
    )
  }
}
