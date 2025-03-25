import { getRepositoryRootDir } from './get-repository-root-dir'
import { join } from 'path'
import { CONTENTS_DIR, DATA_DIR } from '../../../src/app/common/directories'

export const REPO_PATH = getRepositoryRootDir()
const SRC_PATH = join(REPO_PATH, 'src')
export const DATA_PATH = join(SRC_PATH, DATA_DIR)
export const CONTENT_PATH = join(SRC_PATH, CONTENTS_DIR)
export const ASSETS_COLLECTIONS_PATH = join(DATA_PATH, 'assets-collections')
