import { Inject, Injectable } from '@angular/core'
import { JSON_DATA_DIR, JsonFetcher } from './json-fetcher'
import { join } from 'path'
import { PUBLIC_DIR } from '@/app/common/directories'
import { appendJsonExtensionIfNeeded } from '@/app/common/json/json-extension-utils'
import { readJsonSync } from '@/app/common/json/json-file-utils'
import { REPO_ROOT_DIRECTORY } from '@/app/common/repo-root-directory'

@Injectable({ providedIn: 'root' })
export class LocalJsonFetcherService implements JsonFetcher {
  constructor(@Inject(JSON_DATA_DIR) private readonly _jsonDataDir: string) {}

  async fetch<T extends object>(...pathSegments: string[]): Promise<T> {
    return readJsonSync<T>(
      appendJsonExtensionIfNeeded(
        join(
          REPO_ROOT_DIRECTORY,
          PUBLIC_DIR,
          this._jsonDataDir,
          ...pathSegments,
        ),
      ),
    )
  }
}
