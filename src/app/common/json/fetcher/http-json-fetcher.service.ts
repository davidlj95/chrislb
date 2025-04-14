import { JSON_DATA_DIR, JsonFetcher } from './json-fetcher'
import { HttpClient } from '@angular/common/http'
import { firstValueFrom } from 'rxjs'
import { Inject, Injectable } from '@angular/core'
import { APP_BASE_HREF } from '@angular/common'
import { appendJsonExtensionIfNeeded } from '@/app/common/json/json-extension-utils'

@Injectable({ providedIn: 'root' })
export class HttpJsonFetcherService implements JsonFetcher {
  constructor(
    private readonly _httpClient: HttpClient,
    @Inject(APP_BASE_HREF) private readonly _baseHref: string,
    @Inject(JSON_DATA_DIR) private readonly _jsonDataDir: string,
  ) {}

  async fetch<T>(...pathSegments: string[]): Promise<T> {
    return firstValueFrom(
      this._httpClient.get<T>(
        appendJsonExtensionIfNeeded(
          [this._baseHref, this._jsonDataDir, ...pathSegments]
            .join('/')
            .replace(/^\//, ''),
        ),
      ),
    )
  }
}
