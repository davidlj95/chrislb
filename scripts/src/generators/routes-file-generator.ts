import { isMain } from '../utils/is-main'
import { Log } from '../utils/log'
import { join } from 'path'
import { PROJECTS_DIR } from '../../../src/app/common/directories'
import { readFileSync, writeFileSync } from 'fs'
import { ProjectListItem } from '../../../src/app/projects/project'
import { appendJsonExtension, readJson } from '../resources/json'
import { CONTENT_PATH, REPO_PATH } from '../utils/paths'

export class RoutesFileGenerator {
  async all(): Promise<void> {
    Log.group('Routes file')
    Log.info("Reading base routes file '%s'", BASE_ROUTES_FILENAME)
    const baseRoutes = await this._getBaseRoutes()
    Log.info('Found %d base routes', baseRoutes.length)
    Log.info('Listing projects with contents')
    const projectListJson = await readJson<readonly ProjectListItem[]>(
      join(CONTENT_PATH, appendJsonExtension(PROJECTS_DIR)),
    )
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
    writeFileSync(join(REPO_PATH, ROUTES_FILENAME), allRoutes.join('\n'))
  }

  private async _getBaseRoutes(): Promise<readonly string[]> {
    const baseRoutesFile = readFileSync(
      join(REPO_PATH, BASE_ROUTES_FILENAME),
      'utf-8',
    )
    return baseRoutesFile.split('\n').filter((route) => route.length)
  }
}

const BASE_ROUTES_FILENAME = 'routes-file.base.txt'
const ROUTES_FILENAME = 'routes-file.txt'

if (isMain(import.meta.url)) {
  await new RoutesFileGenerator().all()
  Log.ok('All done')
}
