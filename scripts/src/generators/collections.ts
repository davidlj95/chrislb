import { ResourceCollection } from '../resources/resource-collection'
import { join } from 'path'
import {
  CONTENTS_DIR,
  DATA_DIR,
  PROJECTS_DIR,
} from '../../../src/app/common/directories'
import { getRepositoryRootDir } from '../utils/get-repository-root-dir'

export class Collections {
  readonly authors = new ResourceCollection(join(DATA_PATH, 'authors'))
  readonly assetsCollections = new ResourceCollection(
    join(DATA_PATH, 'assets-collections'),
  )
  readonly projects = new ResourceCollection(join(CONTENT_PATH, PROJECTS_DIR))
  readonly misc = new ResourceCollection(join(DATA_PATH, 'misc'))
}

const REPO_PATH = getRepositoryRootDir()
const SRC_PATH = join(REPO_PATH, 'src')
const DATA_PATH = join(SRC_PATH, DATA_DIR)
const CONTENT_PATH = join(SRC_PATH, CONTENTS_DIR)
