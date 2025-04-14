import { JSON_FILES_DIR, JsonFetcher } from './json-fetcher'
import { HttpClient } from '@angular/common/http'
import { firstValueFrom } from 'rxjs'
import { inject, InjectionToken } from '@angular/core'
import { APP_BASE_HREF } from '@angular/common'
import { appendJsonExtensionIfNeeded } from '@/app/common/json/json-extension-utils'

export const HTTP_JSON_FETCHER = new InjectionToken<JsonFetcher>(
  'HTTP JSON fetcher',
  {
    factory: () => {
      const httpClient = inject(HttpClient)
      const baseHref = inject(APP_BASE_HREF)
      return <T extends object>(...pathSegments: readonly string[]) =>
        firstValueFrom(
          httpClient.get<T>(
            appendJsonExtensionIfNeeded(
              [baseHref, JSON_FILES_DIR, ...pathSegments]
                .join('/')
                .replace(/^\//, ''),
            ),
          ),
        )
    },
  },
)
