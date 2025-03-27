import { basename, join } from 'path'
import { readdir, writeFile } from 'fs/promises'
import { readFile } from 'node:fs/promises'
import { Log } from './log'
import { writeFileSync } from 'fs'

const CACHED_JSONS = new Map<string, object>()
export const readJson = async <T extends object = object>(
  path: string,
  opts: { fallback?: T } = {},
): Promise<T> => {
  const cachedJson = CACHED_JSONS.get(path)
  if (cachedJson) {
    return cachedJson as T
  }
  let json: object
  try {
    json = JSON.parse(await readFile(path, 'utf-8'))
  } catch {
    if (opts.fallback) {
      Log.info('File "%s" cannot be read. Using fallback value', path)
      return opts.fallback
    }
    throw new Error(`Unable to read file ${path}`)
  }
  CACHED_JSONS.set(path, json)
  return json as T
}

export const writeJson = async (path: string, data: object): Promise<void> =>
  writeFile(path, stringifyJson(data))

export const writeJsonSync = async (
  path: string,
  data: object,
): Promise<void> => writeFileSync(path, stringifyJson(data))

const stringifyJson = (json: object): string => JSON.stringify(json, null, 2)

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
