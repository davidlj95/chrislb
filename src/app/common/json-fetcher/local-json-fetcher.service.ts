import { Inject, Injectable } from '@angular/core'
import { JSON_DATA_DIR, JsonFetcher } from './json-fetcher'
import { readFileSync } from 'fs'
import { resolve } from 'path'

@Injectable({ providedIn: 'root' })
export class LocalJsonFetcherService implements JsonFetcher {
  constructor(@Inject(JSON_DATA_DIR) private jsonDataDir: string) {}

  async fetch<T>(...pathSegments: string[]): Promise<T> {
    const jsonFile = resolve(__dirname, this.jsonDataDir, ...pathSegments)
    //👇 Promises would be out of zone.js, so using sync. Could be improved
    const contents = readFileSync(jsonFile)
    return JSON.parse(contents.toString())
  }
}
