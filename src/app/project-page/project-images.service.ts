import { Injectable } from '@angular/core'
import { ImageAsset } from '../common/images/image-asset'
import { JsonFetcher } from '../common/json-fetcher/json-fetcher'
import { PROJECTS_DIR } from '../common/directories'
import { from, Observable } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class ProjectImagesService {
  constructor(private jsonFetcher: JsonFetcher) {}

  bySlugAndFilename(
    slug: string,
    filename: string,
  ): Observable<ReadonlyArray<ImageAsset>> {
    return from(
      this.jsonFetcher.fetch<ReadonlyArray<ImageAsset>>(
        PROJECTS_DIR,
        slug,
        filename,
      ),
    )
  }
}
