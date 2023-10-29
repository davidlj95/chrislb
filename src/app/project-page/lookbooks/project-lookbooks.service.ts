import { Injectable } from '@angular/core'
import { from, Observable } from 'rxjs'
import { Lookbook } from './lookbook/lookbook'
import { JsonFetcher } from '../../common/json-fetcher/json-fetcher-injection-token'
import { PROJECTS_DIR } from '../../common/directories'
import { LOOKBOOKS_IMAGES_FILENAME } from '../../common/files'

@Injectable({
  providedIn: 'root',
})
export class ProjectLookbooksService {
  constructor(private jsonFetcher: JsonFetcher) {}

  bySlug(projectSlug: string): Observable<ReadonlyArray<Lookbook>> {
    return from(this.getLookbooks(projectSlug))
  }

  private async getLookbooks(
    projectSlug: string,
  ): Promise<ReadonlyArray<Lookbook>> {
    const lookbooksImages = await this.jsonFetcher.fetch(
      PROJECTS_DIR,
      projectSlug,
      LOOKBOOKS_IMAGES_FILENAME,
    )
    return (lookbooksImages as ReadonlyArray<Lookbook> | undefined) ?? []
  }
}
