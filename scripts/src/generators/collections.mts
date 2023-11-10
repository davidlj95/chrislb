import { ResourceCollection } from '../resources/resource-collection.mts'
import { join } from 'path'
import {
  CONTENTS_DIR,
  DATA_DIR,
  PROJECTS_DIR,
} from '../../../src/app/common/directories.ts'
import { getRepositoryRootDir } from '../utils/get-repository-root-dir.mts'

export class Collections {
  private readonly REPO_PATH = getRepositoryRootDir()
  private readonly SRC_PATH = join(this.REPO_PATH, 'src')
  private readonly DATA_PATH = join(this.SRC_PATH, DATA_DIR)
  private readonly CONTENT_PATH = join(this.SRC_PATH, CONTENTS_DIR)

  public readonly authors = new ResourceCollection(
    join(this.DATA_PATH, 'authors'),
  )
  public readonly assetsCollections = new ResourceCollection(
    join(this.DATA_PATH, 'assets-collections'),
  )
  public readonly projects = new ResourceCollection(
    join(this.CONTENT_PATH, PROJECTS_DIR),
  )
  public readonly misc = new ResourceCollection(join(this.DATA_PATH, 'misc'))
}
