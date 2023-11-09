import { readFile, writeFile } from 'fs/promises'
import { Log } from './log.mjs'
import { FileWriter } from './file-writer.mjs'
import { FileReader } from './file-reader.mjs'

export class JsonFile implements FileReader, FileWriter {
  constructor(public filepath: string) {}

  public async read(): Promise<unknown> {
    try {
      return JSON.parse(await readFile(this.filepath, 'utf-8'))
    } catch (error) {
      Log.warn('Unable to read file %s', this.filepath)
      return
    }
  }

  public async write(json: unknown): Promise<void> {
    return writeFile(this.filepath, JSON.stringify(json, null, 2))
  }
}
