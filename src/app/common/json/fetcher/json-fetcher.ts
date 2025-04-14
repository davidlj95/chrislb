import { InjectionToken } from '@angular/core'
import { CONTENTS_DIR } from '../../directories'

export const JSON_DATA_DIR = new InjectionToken<string>('JSON data dir', {
  factory: () => CONTENTS_DIR,
})

export abstract class JsonFetcher {
  abstract fetch<T extends object>(...pathSegments: string[]): Promise<T>
}
