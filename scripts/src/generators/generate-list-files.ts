import { isMain } from '../utils/is-main'
import { Log } from '../utils/log'
import {
  appendJsonExtension,
  listJsonFilesInDirectory,
  readJson,
  removeJsonExtension,
  writeJson,
} from '../utils/json'
import { basename, join } from 'path'
import { ASSETS_COLLECTIONS_PATH, AUTHORS_PATH } from '../utils/paths'

export const generateListFiles = () =>
  Promise.all([
    generateListFileForDirectory(AUTHORS_PATH, ({ slug }) => ({ slug })),
    generateListFileForDirectory(ASSETS_COLLECTIONS_PATH),
  ])

const generateListFileForDirectory = async <T = object>(
  path: string,
  listItemExtraDataGenerator?: (opts: { slug: string }) => object,
): Promise<void> => {
  Log.group('Generating list file for JSON files in %s', path)
  const jsonFiles = await listJsonFilesInDirectory(path)
  Log.info('Found %d files to include in list', jsonFiles.length)
  const jsonList = await Promise.all(
    jsonFiles.map<Promise<T>>(async (jsonFile) => {
      Log.item('Processing JSON file %s', basename(jsonFile))
      const json = await readJson<T>(jsonFile)
      const listItemExtraData = listItemExtraDataGenerator
        ? listItemExtraDataGenerator({
            slug: removeJsonExtension(basename(jsonFile)),
          })
        : {}
      return {
        ...json,
        ...listItemExtraData,
      }
    }),
  )
  const jsonListFile = join(path, '..', appendJsonExtension(basename(path)))
  Log.info('Writing list to %s', jsonListFile)
  await writeJson(jsonListFile, jsonList)
  Log.ok('Done')
  Log.groupEnd()
}

if (isMain(import.meta.url)) {
  await generateListFiles()
  Log.ok('All done')
}
