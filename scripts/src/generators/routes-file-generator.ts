import { isMain } from '../utils/is-main'
import { Log } from '../utils/log'
import { getRepositoryRootDir } from '../utils/get-repository-root-dir'
import { join } from 'path'
import { CONTENTS_DIR } from '../../../src/app/common/directories'
import { readFileSync, writeFileSync } from 'fs'
import { JsonFileType } from '../resources/file'
import { ProjectListItem } from '../../../src/app/projects/project'

export class RoutesFileGenerator {
  async all(): Promise<void> {
    Log.group('Routes file')
    Log.info("Reading base routes file '%s'", BASE_ROUTES_FILENAME)
    const baseRoutes = await this._getBaseRoutes()
    Log.info('Found %d base routes', baseRoutes.length)
    Log.info('Listing projects with contents')
    const projectListFile = join(CONTENTS_PATH, 'projects.json')
    const projectListJson = (await new JsonFileType().read(
      projectListFile,
    )) as readonly ProjectListItem[]
    const projectSlugsWithContent = projectListJson
      .filter((projectListItem) => projectListItem.hasDetails)
      .map(({ slug }) => slug)
    Log.info('Found %d projects with contents', projectSlugsWithContent.length)
    projectSlugsWithContent.forEach((slug) => Log.item(slug))
    const projectRoutes = projectSlugsWithContent.map(
      (projectSlug) => `/projects/${projectSlug}`,
    )
    Log.info('Generated routes')
    projectRoutes.forEach((route) => Log.item(route))
    const allRoutes = [...baseRoutes, ...projectRoutes].sort()
    Log.info('Writing all routes (%d)', allRoutes.length)
    writeFileSync(join(ROOT_PATH, ROUTES_FILENAME), allRoutes.join('\n'))
  }

  private async _getBaseRoutes(): Promise<readonly string[]> {
    const baseRoutesFile = readFileSync(
      join(ROOT_PATH, BASE_ROUTES_FILENAME),
      'utf-8',
    )
    return baseRoutesFile.split('\n').filter((route) => route.length)
  }
}

const ROOT_PATH = getRepositoryRootDir()
const BASE_ROUTES_FILENAME = 'routes-file.base.txt'
const ROUTES_FILENAME = 'routes-file.txt'
const CONTENTS_PATH = join(ROOT_PATH, 'src', CONTENTS_DIR)

if (isMain(import.meta.url)) {
  await new RoutesFileGenerator().all()
  Log.ok('All done')
}
