import { readdir, readFile, writeFile } from 'fs/promises'
import { Dirent, readFileSync, writeFileSync } from 'fs'
import { JSON_EXTENSION } from './json-extension-utils'

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
      return opts.fallback
    }
    throw new Error(`Unable to read file ${path}`)
  }
  CACHED_JSONS.set(path, json)
  return json as T
}
export const readJsonSync = <T extends object>(path: string): T =>
  CACHED_JSONS.get(path) ?? JSON.parse(readFileSync(path, 'utf-8'))

export const writeJson = async (path: string, data: object): Promise<void> =>
  writeFile(path, stringifyJson(data))

export const writeJsonSync = async (
  path: string,
  data: object,
): Promise<void> => writeFileSync(path, stringifyJson(data))

const stringifyJson = (json: object): string => JSON.stringify(json, null, 2)

export const listJsonFilesInDirectory = async (
  path: string,
): Promise<readonly Dirent[]> => {
  return (
    await readdir(path, {
      withFileTypes: true,
    })
  ).filter((dirent) => dirent.isFile() && dirent.name.endsWith(JSON_EXTENSION))
}
