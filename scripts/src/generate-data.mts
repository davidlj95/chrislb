import { isMain } from './is-main.mjs'
import { Log } from './log.mjs'
import { readdir, readFile, writeFile } from 'fs/promises'
import { getRepositoryRootDir } from './get-repository-root-dir.mjs'
import path from 'path'

const PROJECTS_DIR = path.join(
  getRepositoryRootDir(),
  'src',
  'data',
  'projects',
)
const JSON_DATA_FILENAME = 'data.json'
const LIST_JSON_FILENAME = 'list.json'

async function generateData() {
  const projectDirectories = (
    await readdir(PROJECTS_DIR, { withFileTypes: true })
  ).filter((dirent) => dirent.isDirectory())
  Log.info('Found %d project directories', projectDirectories.length)
  projectDirectories.forEach((projectDirectory) =>
    Log.item(projectDirectory.name),
  )
  Log.info('Reading data from each project directory')
  const dataJsons = await Promise.all(
    projectDirectories.map(async (projectDirectory) => {
      Log.item(projectDirectory.name)
      const jsonData = await readFile(
        path.join(PROJECTS_DIR, projectDirectory.name, JSON_DATA_FILENAME),
      )
      return JSON.parse(jsonData.toString())
    }),
  )
  await writeFile(
    path.join(PROJECTS_DIR, LIST_JSON_FILENAME),
    JSON.stringify(dataJsons, null, 2),
  )
}

if (isMain(import.meta.url)) {
  await generateData()
  Log.ok('All done')
}
