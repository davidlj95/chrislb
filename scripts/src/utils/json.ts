import { basename, join } from 'path'
import { readdir, writeFile } from 'fs/promises'
import { readFile } from 'node:fs/promises'

const CACHED_JSONS = new Map<string, object>()
export const readJson = async <T extends object = object>(
  path: string,
): Promise<T> => {
  const cachedJson = CACHED_JSONS.get(path)
  if (cachedJson) {
    return cachedJson as T
  }
  let json: object
  try {
    json = JSON.parse(await readFile(path, 'utf-8'))
  } catch {
    throw new Error(`Unable to read file ${path}`)
  }
  CACHED_JSONS.set(path, json)
  return json as T
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
