export interface FileReader {
  readonly filepath: string

  read(): Promise<unknown>
}
