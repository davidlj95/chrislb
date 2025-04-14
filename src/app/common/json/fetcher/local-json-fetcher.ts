import { InjectionToken } from '@angular/core'
import { JSON_FILES_DIR, JsonFetcher } from './json-fetcher'
import { join } from 'path'
import { PUBLIC_DIR } from '@/app/common/directories'
import { appendJsonExtensionIfNeeded } from '@/app/common/json/json-extension-utils'
import { readJsonSync } from '@/app/common/json/json-file-utils'
import { REPO_ROOT_DIRECTORY } from '@/app/common/repo-root-directory'
import { of } from 'rxjs'

export const LOCAL_JSON_FETCHER = new InjectionToken<JsonFetcher>(
  'Local JSON fetcher',
  {
    factory:
      () =>
      <T extends object>(...pathSegments: readonly string[]) =>
        of(
          readJsonSync<T>(
            appendJsonExtensionIfNeeded(
              join(
                REPO_ROOT_DIRECTORY,
                PUBLIC_DIR,
                JSON_FILES_DIR,
                ...pathSegments,
              ),
            ),
          ),
        ),
  },
)
