import { Inject, Injectable } from '@angular/core'
import { JSON_DATA_DIR, JsonFetcher } from './json-fetcher-injection-token'
import * as path from 'path'
import * as fs from 'fs'
import { Json } from './json-types'

@Injectable({
  providedIn: 'root',
})
export class LocalJsonFetcherService implements JsonFetcher {
  constructor(@Inject(JSON_DATA_DIR) private jsonDataDir: string) {}

  async fetch(...pathSegments: string[]): Promise<Json | undefined> {
    const jsonFile = path.resolve(__dirname, this.jsonDataDir, ...pathSegments)
    //👇 Promises would be out of zone.js, so using sync. Could be improved
    const contents = fs.readFileSync(jsonFile)
    return JSON.parse(contents.toString())
  }
}
