import { basename } from 'path'
import { writeFile } from 'fs/promises'
import { Log } from '../utils/log'
import { readFile } from 'node:fs/promises'

export abstract class FileType {
  protected constructor(readonly extension: string) {
    if (!extension.startsWith('.')) {
      throw new Error('Extension must start with a dot')
    }
  }

  abstract read(path: string): Promise<unknown>

  abstract write(path: string, data: unknown): Promise<void>

  appendExtension(basename: string): string {
    return `${basename}${this.extension}`
  }

  removeExtension(filename: string): string {
    return basename(filename, this.extension)
  }
}

export class JsonFileType extends FileType {
  constructor() {
    super('.json')
  }

  async read(path: string): Promise<unknown> {
    try {
      return JSON.parse(await readFile(path, 'utf-8'))
    } catch {
      Log.warn('Unable to read file %s', path)
      return
    }
  }

  async write(path: string, json: unknown): Promise<void> {
    return writeFile(path, JSON.stringify(json, null, 2))
  }
}
