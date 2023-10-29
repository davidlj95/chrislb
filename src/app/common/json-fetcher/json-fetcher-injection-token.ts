import { InjectionToken } from '@angular/core'
import { Json } from './json-types'
import { CONTENTS_DIR } from '../directories'

export const JSON_DATA_DIR = new InjectionToken<string>('JSON data dir', {
  factory: () => CONTENTS_DIR,
})

export abstract class JsonFetcher {
  abstract fetch(...pathSegments: string[]): Promise<Json | undefined>
}
