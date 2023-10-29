import { isMain } from './is-main.mjs'
import { Log } from './log.mjs'
import { readdir, readFile, writeFile } from 'fs/promises'
import { getRepositoryRootDir } from './get-repository-root-dir.mjs'
import path from 'path'

const DATA_DIR = path.join(getRepositoryRootDir(), 'src', 'data')
const DATA_EXTENSION = '.json'

class DataGenerator {
  async all() {
    await this.listFromDirectoryWithJsons('projects')
    await this.listFromDirectoryWithJsons('authors')
  }

  private async listFromDirectoryWithJsons(directory: string) {
    Log.group('List of %s', directory)
    const jsonFilesDirectory = path.join(DATA_DIR, directory)
    const jsonFiles = (
      await readdir(jsonFilesDirectory, { withFileTypes: true })
    ).filter(
      (dirent) => dirent.isFile() && dirent.name.endsWith(DATA_EXTENSION),
    )
    Log.info('Found %d JSON files', jsonFiles.length)
    jsonFiles.forEach((jsonFile) => Log.item(jsonFile.name))
    Log.info('Reading data from each file')
    const jsons = await Promise.all(
      jsonFiles.map(async (jsonFile) => {
        Log.item(jsonFile.name)
        const buffer = await readFile(
          path.join(jsonFilesDirectory, jsonFile.name),
        )
        const json = JSON.parse(buffer.toString())
        if (!json.slug) {
          json.slug = path.basename(jsonFile.name, DATA_EXTENSION)
        }
        return json
      }),
    )
    await writeFile(
      path.join(DATA_DIR, `${directory}-list.json`),
      JSON.stringify(jsons, null, 2),
    )
    Log.groupEnd()
  }
}

if (isMain(import.meta.url)) {
  await new DataGenerator().all()
  Log.ok('All done')
}
