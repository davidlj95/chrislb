import { readFile, writeFile } from 'fs/promises'
import { Log } from './log.mjs'

export class JsonFile {
  constructor(public filename: string) {}

  public async read(): Promise<unknown> {
    try {
      return JSON.parse(await readFile(this.filename, 'utf-8'))
    } catch (error) {
      Log.warn('Unable to read file %s', this.filename)
      return undefined
    }
  }

  public async write(json: unknown): Promise<void> {
    return writeFile(this.filename, JSON.stringify(json, null, 2))
  }
}
