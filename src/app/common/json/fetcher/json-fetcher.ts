import { InjectionToken, Provider } from '@angular/core'
import { CONTENTS_DIR } from '../../directories'
import { Observable } from 'rxjs'

export const JSON_FETCHER = new InjectionToken<JsonFetcher>('JSON fetcher')
export type JsonFetcher = <T extends object>(
  ...pathSegments: string[]
) => Observable<T>
export const provideJsonFetcher = (
  jsonFetcherToken: InjectionToken<JsonFetcher>,
): Provider => ({
  provide: JSON_FETCHER,
  useExisting: jsonFetcherToken,
})

export const JSON_FILES_DIR = CONTENTS_DIR
