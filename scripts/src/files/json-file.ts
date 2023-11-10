import { Log } from '../utils/log'
import { FileWriter } from './file-writer'
import { FileReader } from './file-reader'
import { readFileSync, writeFileSync } from 'fs'

export class JsonFile implements FileReader, FileWriter {
  constructor(public filepath: string) {}

  public async read(): Promise<unknown> {
    try {
      return JSON.parse(readFileSync(this.filepath, 'utf-8'))
    } catch (error) {
      Log.warn('Unable to read file %s', this.filepath)
      return
    }
  }

  public async write(json: unknown): Promise<void> {
    return writeFileSync(this.filepath, JSON.stringify(json, null, 2))
  }
}
