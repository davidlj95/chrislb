import { FileReader } from './file-reader.mjs'
import { FileWriter } from './file-writer.mjs'
import { basename } from 'path'

export class DataType {
  constructor(
    public readonly extension: string,
    readonly reader: { new (filepath: string): FileReader },
    readonly writer: { new (filepath: string): FileWriter },
  ) {
    if (!extension.startsWith('.')) {
      throw new Error('Extension must start with a dot')
    }
  }

  appendExtension(basename: string): string {
    return `${basename}${this.extension}`
  }

  removeExtension(filename: string): string {
    return basename(filename, this.extension)
  }
}