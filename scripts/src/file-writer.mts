export interface FileWriter {
  readonly filepath: string

  write(data: unknown): Promise<void>
}
