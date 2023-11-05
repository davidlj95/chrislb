import { isMain } from './is-main.mjs'
import { Log } from './log.mjs'
import path from 'path'
import { getRepositoryRootDir } from './get-repository-root-dir.mjs'
import { readdir, readFile, writeFile } from 'fs/promises'
import directoriesPkg from '../../src/app/common/directories.js'

const { CONTENTS_DIR, PROJECTS_DIR } = directoriesPkg

export class RoutesFileGenerator {
  private readonly ROOT_PATH = getRepositoryRootDir()
  private readonly BASE_ROUTES_FILENAME = 'routes-file.base.txt'
  private readonly ROUTES_FILENAME = 'routes-file.txt'
  private readonly PROJECTS_PATH = path.join(
    this.ROOT_PATH,
    'src',
    CONTENTS_DIR,
    PROJECTS_DIR,
  )

  public async all(): Promise<void> {
    Log.group('Routes file')
    Log.info("Reading base routes file '%s'", this.BASE_ROUTES_FILENAME)
    const baseRoutes = await this.getBaseRoutes()
    Log.info('Found %d base routes', baseRoutes.length)
    Log.info('Listing projects with contents')
    const projectDirs = (
      await readdir(this.PROJECTS_PATH, {
        withFileTypes: true,
      })
    ).filter((dirent) => dirent.isDirectory())
    const projectDirsWithContent = (
      await Promise.all(
        projectDirs.map(async (projectDir) => {
          const projectDirFiles = await readdir(
            path.join(this.PROJECTS_PATH, projectDir.name),
            { withFileTypes: true },
          )
          return projectDirFiles.length > 0 ? projectDir.name : ''
        }),
      )
    ).filter((projectDir) => projectDir.length)
    Log.info('Found %d projects with contents', projectDirsWithContent.length)
    projectDirsWithContent.forEach((dir) => Log.item(dir))
    const projectRoutes = projectDirsWithContent.map(
      (projectDirWithContent) => `/projects/${projectDirWithContent}`,
    )
    Log.info('Generated routes')
    projectRoutes.forEach((route) => Log.item(route))
    const allRoutes = [...baseRoutes, ...projectRoutes].sort()
    Log.info('Writing all routes (%d)', allRoutes.length)
    await writeFile(
      path.join(this.ROOT_PATH, this.ROUTES_FILENAME),
      allRoutes.join('\n'),
    )
  }

  private async getBaseRoutes(): Promise<ReadonlyArray<string>> {
    const baseRoutesFile = await readFile(
      path.join(this.ROOT_PATH, this.BASE_ROUTES_FILENAME),
      'utf-8',
    )
    return baseRoutesFile.split('\n').filter((route) => route.length)
  }
}

if (isMain(import.meta.url)) {
  await new RoutesFileGenerator().all()
  Log.ok('All done')
}
