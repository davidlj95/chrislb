import { basename, join } from 'path'
import { readdir, writeFile } from 'fs/promises'
import { readFile } from 'node:fs/promises'

export const readJson = async <T = unknown>(path: string): Promise<T> => {
  try {
    return JSON.parse(await readFile(path, 'utf-8'))
  } catch {
    throw new Error(`Unable to read file ${path}`)
  }
}
export const writeJson = async (path: string, data: unknown): Promise<void> =>
  writeFile(path, JSON.stringify(data, null, 2))

export const listJsonFilesInDirectory = async (
  path: string,
): Promise<readonly string[]> => {
  return (
    await readdir(path, {
      withFileTypes: true,
    })
  )
    .filter((dirent) => dirent.isFile() && dirent.name.endsWith(JSON_EXTENSION))
    .map(({ name }) => join(path, name))
}

export const appendJsonExtension = (basename: string): string =>
  `${basename}${JSON_EXTENSION}`

export const removeJsonExtension = (filename: string): string =>
  basename(filename, JSON_EXTENSION)

export const JSON_EXTENSION = '.json'
