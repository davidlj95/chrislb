import { Injectable } from '@angular/core'
import { ImageAsset } from '../common/images/types'
import { JsonFetcher } from '../common/json-fetcher/json-fetcher'
import { PROJECTS_DIR } from '../common/directories'

@Injectable({
  providedIn: 'root',
})
export class ProjectImagesService {
  constructor(private jsonFetcher: JsonFetcher) {}

  bySlugAndFilename(
    slug: string,
    filename: string,
  ): Promise<ReadonlyArray<ImageAsset>> {
    return this.jsonFetcher.fetch(PROJECTS_DIR, slug, filename)
  }
}
