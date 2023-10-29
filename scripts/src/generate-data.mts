import { isMain } from './is-main.mjs'
import { Log } from './log.mjs'
import { readdir, readFile, writeFile } from 'fs/promises'
import { getRepositoryRootDir } from './get-repository-root-dir.mjs'
import path from 'path'
import { Dirent } from 'fs'
import directoriesPkg from '../../src/app/common/data/directories.js'
import filesPkg from '../../src/app/common/data/files.js'
import lookbookNames from '../../src/data/lookbook-names.json' assert { type: 'json' }
import { Lookbook } from '../../src/app/project-page/lookbooks/lookbook/lookbook.js'

const { DATA_DIR, PROJECTS_DIR } = directoriesPkg
const { getListFilename, LOOKBOOKS_IMAGES_FILENAME, PREVIEW_IMAGES_FILENAME } =
  filesPkg

const DATA_PATH = path.join(getRepositoryRootDir(), 'src', DATA_DIR)
const DATA_EXTENSION = '.json'

class DataGenerator {
  async all() {
    await this.listFromDirectoryWithJsons(PROJECTS_DIR)
    await this.listFromDirectoryWithJsons('authors')
    await this.addContentToListFile({
      dataSubdirectory: PROJECTS_DIR,
      contentFilename: PREVIEW_IMAGES_FILENAME,
    })
    await this.addNamesToLookbooks()
  }

  private async listFromDirectoryWithJsons(dataSubdirectory: string) {
    Log.group('List of %s', dataSubdirectory)
    const directoryPath = path.join(DATA_PATH, dataSubdirectory)
    const dataFiles = await this.getDataFilesInDirectory(directoryPath)
    Log.info('Reading data from each file')
    const jsons = await Promise.all(
      dataFiles.map(async (dataFile) => {
        Log.item(dataFile.name)
        const json = (await this.readJson(
          path.join(directoryPath, dataFile.name),
        )) as {
          slug: string | undefined
        }
        if (!json.slug) {
          json.slug = path.basename(dataFile.name, DATA_EXTENSION)
        }
        return json
      }),
    )
    await this.writeListFile(dataSubdirectory, jsons)
    Log.groupEnd()
  }

  private async addContentToListFile({
    dataSubdirectory,
    contentFilename,
  }: {
    dataSubdirectory: string
    contentFilename: string
  }) {
    Log.group('Add %s to %s', contentFilename, dataSubdirectory)
    const directoryPath = path.join(DATA_PATH, dataSubdirectory)
    const dataFiles = await this.getDataFilesInDirectory(directoryPath)
    Log.info('Reading content from each file homonym directory')
    const slugsAndContents = (await Promise.all(
      dataFiles.map(async (jsonFile) => {
        const slug = path.basename(jsonFile.name, DATA_EXTENSION)
        // noinspection UnnecessaryLocalVariableJS
        const homonymDirectory = slug
        const contentFile = path.join(
          directoryPath,
          homonymDirectory,
          contentFilename,
        )
        Log.item(path.join(homonymDirectory, contentFilename))
        return [slug, await this.readJson(contentFile)]
      }),
    )) as ReadonlyArray<[string, unknown]>
    const contentsBySlug = new Map(slugsAndContents)
    const listJson = (await this.readListFile(
      dataSubdirectory,
    )) as ReadonlyArray<{
      slug: string
      [key: string]: unknown
    }>
    listJson.forEach((item) => {
      item[this.camelize(contentFilename)] = contentsBySlug.get(item.slug)
    })
    await this.writeListFile(dataSubdirectory, listJson)
    Log.groupEnd()
  }

  private async addNamesToLookbooks() {
    Log.group('Add names to lookbooks')
    Log.info('Reading lookbook names file')
    const lookbookNamesBySlug = new Map(
      lookbookNames.namesBySlug.map(({ slug, name }) => [slug, name]),
    )
    const directoryPath = path.join(DATA_PATH, PROJECTS_DIR)
    const dataFiles = await this.getDataFilesInDirectory(directoryPath)
    Log.info("Adding lookbook names to each project's lookbooks")
    await Promise.all(
      dataFiles.map(async (jsonFile) => {
        Log.item(jsonFile.name)
        // noinspection UnnecessaryLocalVariableJS
        const slug = path.basename(jsonFile.name, DATA_EXTENSION)
        // noinspection UnnecessaryLocalVariableJS
        const homonymDirectory = slug
        const lookbookFilename = path.join(
          directoryPath,
          homonymDirectory,
          LOOKBOOKS_IMAGES_FILENAME,
        )
        const lookbookContents = await this.readJson(lookbookFilename)
        if (!lookbookContents) {
          return
        }
        const lookbookJson = lookbookContents as ReadonlyArray<Lookbook>
        const lookbookJsonWithNames = lookbookJson.map((lookbook) => ({
          ...lookbook,
          name: lookbookNamesBySlug.get(lookbook.slug),
        }))
        await this.writeJson(lookbookFilename, lookbookJsonWithNames)
      }),
    )
    Log.groupEnd()
  }

  private async getDataFilesInDirectory(
    directoryPath: string,
  ): Promise<ReadonlyArray<Dirent>> {
    const dataFiles = (
      await readdir(directoryPath, { withFileTypes: true })
    ).filter(
      (dirent) => dirent.isFile() && dirent.name.endsWith(DATA_EXTENSION),
    )
    Log.info('Found %d JSON files', dataFiles.length)
    dataFiles.forEach((jsonFile) => Log.item(jsonFile.name))
    return dataFiles
  }

  private async writeListFile(
    dataSubdirectory: string,
    data: unknown,
  ): Promise<void> {
    const listFilename = getListFilename(dataSubdirectory)
    Log.info('Writing list file', listFilename)
    const listFilePath = this.getListFilePath(listFilename)
    return this.writeJson(listFilePath, data)
  }

  private async readListFile(dataSubdirectory: string): Promise<unknown> {
    const listFilename = getListFilename(dataSubdirectory)
    Log.info('Reading list file', listFilename)
    const listFilePath = this.getListFilePath(listFilename)
    return this.readJson(listFilePath)
  }

  private getListFilePath(listFilename: string): string {
    return path.join(DATA_PATH, listFilename)
  }

  private async readJson(filename: string): Promise<unknown> {
    try {
      return JSON.parse(await readFile(filename, 'utf-8'))
    } catch (error) {
      Log.warn('Unable to read file %s', filename)
      return undefined
    }
  }

  private async writeJson(filename: string, json: unknown): Promise<void> {
    return writeFile(filename, JSON.stringify(json, null, 2))
  }

  private camelize(s: string) {
    // https://stackoverflow.com/a/60738940/3263250
    return s.replace(/-./g, (x) => x[1].toUpperCase())
  }
}

if (isMain(import.meta.url)) {
  await new DataGenerator().all()
  Log.ok('All done')
}
