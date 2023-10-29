import { isMain } from './is-main.mjs'
import { Log } from './log.mjs'
import { readdir, readFile, writeFile } from 'fs/promises'
import { getRepositoryRootDir } from './get-repository-root-dir.mjs'
import path from 'path'
import { Dirent } from 'fs'

const DATA_DIR = path.join(getRepositoryRootDir(), 'src', 'data')
const DATA_EXTENSION = '.json'

class DataGenerator {
  async all() {
    const PROJECTS_SUBDIR = 'projects'
    await this.listFromDirectoryWithJsons(PROJECTS_SUBDIR)
    await this.listFromDirectoryWithJsons('authors')
    await this.addContentToListFile({
      dataSubdirectory: PROJECTS_SUBDIR,
      contentSlug: 'preview-images',
    })
  }

  private async listFromDirectoryWithJsons(dataSubdirectory: string) {
    Log.group('List of %s', dataSubdirectory)
    const directoryPath = path.join(DATA_DIR, dataSubdirectory)
    const dataFiles = await this.getDataFilesInDirectory(directoryPath)
    Log.info('Reading data from each file')
    const jsons = await Promise.all(
      dataFiles.map(async (dataFile) => {
        Log.item(dataFile.name)
        const json = (await this.readJson(
          path.join(directoryPath, dataFile.name),
        )) as { slug: string | undefined }
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
    contentSlug,
  }: {
    dataSubdirectory: string
    contentSlug: string
  }) {
    Log.group('Add %s to %s', contentSlug, dataSubdirectory)
    const directoryPath = path.join(DATA_DIR, dataSubdirectory)
    const dataFiles = await this.getDataFilesInDirectory(directoryPath)
    Log.info('Reading content from each file homonym directory')
    const slugsAndContents = (await Promise.all(
      dataFiles.map(async (jsonFile) => {
        const slug = path.basename(jsonFile.name, DATA_EXTENSION)
        // noinspection UnnecessaryLocalVariableJS
        const homonymDirectory = slug
        const contentFilename = `${contentSlug}${DATA_EXTENSION}`
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
      item[this.camelize(contentSlug)] = contentsBySlug.get(item.slug)
    })
    await this.writeListFile(dataSubdirectory, listJson)
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
    const listFilename = this.getListFilename(dataSubdirectory)
    Log.info('Writing list file', listFilename)
    const listFilePath = this.getListFilePath(listFilename)
    return this.writeJson(listFilePath, data)
  }

  private async readListFile(dataSubdirectory: string): Promise<unknown> {
    const listFilename = this.getListFilename(dataSubdirectory)
    Log.info('Reading list file', listFilename)
    const listFilePath = this.getListFilePath(listFilename)
    return this.readJson(listFilePath)
  }

  private getListFilename(dataSubdirectory: string): string {
    return `${dataSubdirectory}-list${DATA_EXTENSION}`
  }

  private getListFilePath(listFilename: string): string {
    return path.join(DATA_DIR, listFilename)
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
