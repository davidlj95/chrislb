import { dirname, join, resolve } from 'path'
import { CONTENTS_DIR, DATA_DIR } from '../../../src/app/common/directories'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export function getRepositoryRootDir() {
  return resolve(__dirname, '..', '..', '..')
}

export const REPO_PATH = getRepositoryRootDir()
const SRC_PATH = join(REPO_PATH, 'src')
export const DATA_PATH = join(SRC_PATH, DATA_DIR)
export const CONTENT_PATH = join(SRC_PATH, CONTENTS_DIR)
export const MISC_PATH = join(DATA_PATH, 'misc')
export const ASSETS_COLLECTIONS_PATH = join(DATA_PATH, 'assets-collections')
export const AUTHORS_PATH = join(DATA_PATH, 'authors')
