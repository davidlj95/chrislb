import { isMain } from './is-main.mjs'
import { Log } from './log.mjs'
import { readdir, readFile, writeFile } from 'fs/promises'
import { getRepositoryRootDir } from './get-repository-root-dir.mjs'
import path from 'path'

const DATA_DIR = path.join(getRepositoryRootDir(), 'src', 'data')
const PROJECTS_DIR = path.join(DATA_DIR, 'projects')
const LIST_JSON_FILE_PATH = path.join(DATA_DIR, 'projects-list.json')

async function generateData() {
  const projectJsonFiles = (
    await readdir(PROJECTS_DIR, { withFileTypes: true })
  ).filter((dirent) => dirent.isFile() && dirent.name.endsWith('json'))
  Log.info('Found %d project JSON files', projectJsonFiles.length)
  projectJsonFiles.forEach((projectDirectory) =>
    Log.item(projectDirectory.name),
  )
  Log.info('Reading data from each file')
  const projectsJsons = await Promise.all(
    projectJsonFiles.map(async (projectJsonFile) => {
      Log.item(projectJsonFile.name)
      const buffer = await readFile(
        path.join(PROJECTS_DIR, projectJsonFile.name),
      )
      return JSON.parse(buffer.toString())
    }),
  )
  await writeFile(LIST_JSON_FILE_PATH, JSON.stringify(projectsJsons, null, 2))
}

if (isMain(import.meta.url)) {
  await generateData()
  Log.ok('All done')
}
