import { Log } from '../utils/log.mts'
import { FileWriter } from './file-writer.mts'
import { FileReader } from './file-reader.mts'
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
