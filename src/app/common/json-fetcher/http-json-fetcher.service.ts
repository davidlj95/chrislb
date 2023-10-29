import { JSON_DATA_DIR, JsonFetcher } from './json-fetcher-injection-token'
import { HttpClient } from '@angular/common/http'
import { firstValueFrom } from 'rxjs'
import { Inject, Injectable } from '@angular/core'
import { APP_BASE_HREF } from '@angular/common'
import { Json } from './json-types'

@Injectable()
export class HttpJsonFetcherService implements JsonFetcher {
  constructor(
    private httpClient: HttpClient,
    @Inject(APP_BASE_HREF) private baseHref: string,
    @Inject(JSON_DATA_DIR) private jsonDataDir: string,
  ) {}

  async fetch(...pathSegments: string[]): Promise<Json | undefined> {
    const response = firstValueFrom(
      this.httpClient.get(
        [this.baseHref, this.jsonDataDir, ...pathSegments]
          .join('/')
          .replace(/^\//, ''),
      ),
    )
    if (!response) {
      return
    }
    return response as unknown as Json
  }
}
