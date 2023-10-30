import { JSON_DATA_DIR, JsonFetcher } from './json-fetcher'
import { HttpClient } from '@angular/common/http'
import { firstValueFrom } from 'rxjs'
import { Inject, Injectable } from '@angular/core'
import { APP_BASE_HREF } from '@angular/common'

@Injectable({ providedIn: 'root' })
export class HttpJsonFetcherService implements JsonFetcher {
  constructor(
    private httpClient: HttpClient,
    @Inject(APP_BASE_HREF) private baseHref: string,
    @Inject(JSON_DATA_DIR) private jsonDataDir: string,
  ) {}

  async fetch<T>(...pathSegments: string[]): Promise<T> {
    return firstValueFrom(
      this.httpClient.get<T>(
        [this.baseHref, this.jsonDataDir, ...pathSegments]
          .join('/')
          .replace(/^\//, ''),
      ),
    )
  }
}
