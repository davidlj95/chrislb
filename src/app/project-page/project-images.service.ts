import { Injectable } from '@angular/core'
import { from, Observable } from 'rxjs'
import { ImageAsset } from '../../data/images/types'
import { JsonFetcher } from '../common/json-fetcher/json-fetcher-injection-token'
import { PROJECTS_DIR } from '../common/data/directories'

@Injectable({
  providedIn: 'root',
})
export class ProjectImagesService {
  constructor(private jsonFetcher: JsonFetcher) {}

  bySlugAndFilename(
    slug: string,
    filename: string,
  ): Observable<ReadonlyArray<ImageAsset>> {
    const imagesPromise = async () => {
      const images = await this.jsonFetcher.fetch(PROJECTS_DIR, slug, filename)
      return (images as ReadonlyArray<ImageAsset> | undefined) ?? []
    }
    return from(imagesPromise())
  }
}
