import { InjectionToken } from '@angular/core'
import { Json } from './json-types'
import { DATA_DIR } from '../data/directories'

export const JSON_DATA_DIR = new InjectionToken<string>('JSON data dir', {
  factory: () => DATA_DIR,
})

export abstract class JsonFetcher {
  abstract fetch(...pathSegments: string[]): Promise<Json | undefined>
}
