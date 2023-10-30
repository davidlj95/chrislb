import { isMain } from './is-main.mjs'
import { Log } from './log.mjs'
import { readdir } from 'fs/promises'
import { getRepositoryRootDir } from './get-repository-root-dir.mjs'
import path from 'path'
import { Dirent } from 'fs'
import directoriesPkg from '../../src/app/common/directories.js'
import filesPkg from '../../src/app/common/files.js'
import lookbookNamesAndSlugs from '../../src/data/lookbooks/names-by-slug.json' assert { type: 'json' }
import { Lookbook } from '../../src/app/project-page/lookbook'
import { JsonFile } from './json-file.mjs'

const { CONTENTS_DIR, PROJECTS_DIR, DATA_DIR } = directoriesPkg
const { getListFilename, LOOKBOOKS_IMAGES_FILENAME, PREVIEW_IMAGES_FILENAME } =
  filesPkg

const SRC_PATH = path.join(getRepositoryRootDir(), 'src')
const CONTENTS_EXTENSION = '.json'

class ContentsGenerator {
  async all() {
    await this.listFromDirectoryWithJsons(CONTENTS_DIR, PROJECTS_DIR)
    await this.listFromDirectoryWithJsons(DATA_DIR, 'authors')
    await this.addContentToListFile({
      directory: CONTENTS_DIR,
      subdirectory: PROJECTS_DIR,
      subContentFilename: PREVIEW_IMAGES_FILENAME,
    })
    await this.addNamesToLookbooks()
  }

  private async listFromDirectoryWithJsons(
    directory: string,
    subdirectory: string,
  ) {
    Log.group('List of %s in %s', subdirectory, directory)
    const directoryPath = path.join(SRC_PATH, directory, subdirectory)
    const files = await this.getFilesInDirectory(directoryPath)
    Log.info('Reading contents from each file')
    const jsons = await Promise.all(
      files.map(async (file) => {
        Log.item(file.name)
        const json = (await new JsonFile(
          path.join(directoryPath, file.name),
        ).read()) as {
          slug: string | undefined
        }
        if (!json.slug) {
          json.slug = path.basename(file.name, CONTENTS_EXTENSION)
        }
        return json
      }),
    )
    await this.writeListFile(directory, subdirectory, jsons)
    Log.groupEnd()
  }

  private async addContentToListFile({
    directory,
    subdirectory,
    subContentFilename,
  }: {
    directory: string
    subdirectory: string
    subContentFilename: string
  }) {
    Log.group('Add %s to %s/%s', subContentFilename, directory, subdirectory)
    const directoryPath = path.join(SRC_PATH, directory, subdirectory)
    const contentFiles = await this.getFilesInDirectory(directoryPath)
    Log.info('Reading content from each file homonym directory')
    const slugsAndContents = (await Promise.all(
      contentFiles.map(async (contentFile) => {
        const slug = path.basename(contentFile.name, CONTENTS_EXTENSION)
        // noinspection UnnecessaryLocalVariableJS
        const homonymDirectory = slug
        const subContentFile = path.join(
          directoryPath,
          homonymDirectory,
          subContentFilename,
        )
        Log.item(path.join(homonymDirectory, subContentFilename))
        return [slug, await new JsonFile(subContentFile).read()]
      }),
    )) as ReadonlyArray<[string, unknown]>
    const contentsBySlug = new Map(slugsAndContents)
    const listJson = (await this.readListFile(
      directory,
      subdirectory,
    )) as ReadonlyArray<{
      slug: string
      [key: string]: unknown
    }>
    listJson.forEach((item) => {
      item[
        this.camelize(path.basename(subContentFilename, CONTENTS_EXTENSION))
      ] = contentsBySlug.get(item.slug)
    })
    await this.writeListFile(directory, subdirectory, listJson)
    Log.groupEnd()
  }

  private async addNamesToLookbooks() {
    Log.group('Add names to lookbooks')
    Log.info('Reading lookbook names file')
    const lookbookNamesBySlug = new Map(
      lookbookNamesAndSlugs.namesBySlug.map(({ slug, name }) => [slug, name]),
    )
    const directoryPath = path.join(SRC_PATH, CONTENTS_DIR, PROJECTS_DIR)
    const contentFiles = await this.getFilesInDirectory(directoryPath)
    Log.info("Adding lookbook names to each project's lookbooks")
    await Promise.all(
      contentFiles.map(async (contentFile) => {
        Log.item(contentFile.name)
        // noinspection UnnecessaryLocalVariableJS
        const slug = path.basename(contentFile.name, CONTENTS_EXTENSION)
        // noinspection UnnecessaryLocalVariableJS
        const homonymDirectory = slug
        const lookbookFilename = path.join(
          directoryPath,
          homonymDirectory,
          LOOKBOOKS_IMAGES_FILENAME,
        )
        const lookbookJsonFile = new JsonFile(lookbookFilename)
        const lookbookContents = await lookbookJsonFile.read()
        if (!lookbookContents) {
          return
        }
        const lookbookJson = lookbookContents as ReadonlyArray<Lookbook>
        const lookbookJsonWithNames = lookbookJson.map((lookbook) => ({
          ...lookbook,
          name: lookbookNamesBySlug.get(lookbook.slug),
        }))
        await lookbookJsonFile.write(lookbookJsonWithNames)
      }),
    )
    Log.groupEnd()
  }

  private async getFilesInDirectory(
    directory: string,
  ): Promise<ReadonlyArray<Dirent>> {
    const files = (await readdir(directory, { withFileTypes: true })).filter(
      (dirent) => dirent.isFile() && dirent.name.endsWith(CONTENTS_EXTENSION),
    )
    Log.info('Found %d JSON files', files.length)
    files.forEach((file) => Log.item(file.name))
    return files
  }

  private async writeListFile(
    directory: string,
    subdirectory: string,
    contents: unknown,
  ): Promise<void> {
    const listFilename = getListFilename(subdirectory)
    Log.info('Writing list file %s/%s', directory, listFilename)
    const listFilePath = this.getListFilePath(directory, listFilename)
    return new JsonFile(listFilePath).write(contents)
  }

  private async readListFile(
    directory: string,
    subdirectory: string,
  ): Promise<unknown> {
    const listFilename = getListFilename(subdirectory)
    Log.info('Reading list file %s/%s', directory, listFilename)
    const listFilePath = this.getListFilePath(directory, listFilename)
    return new JsonFile(listFilePath).read()
  }

  private getListFilePath(directory: string, listFilename: string): string {
    return path.join(SRC_PATH, directory, listFilename)
  }

  private camelize(s: string) {
    // https://stackoverflow.com/a/60738940/3263250
    return s.replace(/-./g, (x) => x[1].toUpperCase())
  }
}

if (isMain(import.meta.url)) {
  await new ContentsGenerator().all()
  Log.ok('All done')
}
