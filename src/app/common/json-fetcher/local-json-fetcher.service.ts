import { Inject, Injectable } from '@angular/core'
import { JSON_DATA_DIR, JsonFetcher } from './json-fetcher'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import { cwd } from 'process'
import { PUBLIC_DIR } from '@/app/common/directories'

@Injectable({ providedIn: 'root' })
export class LocalJsonFetcherService implements JsonFetcher {
  constructor(@Inject(JSON_DATA_DIR) private readonly _jsonDataDir: string) {}

  async fetch<T>(...pathSegments: string[]): Promise<T> {
    //👇 __dirname no longer exists when using ESBuild
    //   import.meta.url returns an invalid path created by Angular CLI
    //   https://github.com/angular/angular-cli/blob/18.0.5/packages/angular/build/src/utils/server-rendering/esm-in-memory-loader/loader-hooks.ts#L40-L44
    const jsonFile = resolve(
      cwd(),
      PUBLIC_DIR,
      this._jsonDataDir,
      ...pathSegments,
    )
    //👇 Promises would be out of zone.js, so using sync. Could be improved
    const contents = readFileSync(jsonFile)
    return JSON.parse(contents.toString())
  }
}
