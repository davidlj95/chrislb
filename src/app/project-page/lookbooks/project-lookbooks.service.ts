import { Injectable } from '@angular/core'
import { Lookbook } from './lookbook/lookbook'
import { JsonFetcher } from '../../common/json-fetcher/json-fetcher'
import { PROJECTS_DIR } from '../../common/directories'
import { LOOKBOOKS_IMAGES_FILENAME } from '../../common/files'

@Injectable({
  providedIn: 'root',
})
export class ProjectLookbooksService {
  constructor(private jsonFetcher: JsonFetcher) {}

  bySlug(projectSlug: string): Promise<ReadonlyArray<Lookbook>> {
    return this.jsonFetcher.fetch<ReadonlyArray<Lookbook>>(
      PROJECTS_DIR,
      projectSlug,
      LOOKBOOKS_IMAGES_FILENAME,
    )
  }
}
