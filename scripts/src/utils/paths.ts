import { dirname, join, resolve } from 'path'
import {
  CONTENTS_DIR,
  PROJECTS_DIR,
  PUBLIC_DIR,
} from '@/app/common/directories'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export function getRepositoryRootDir() {
  return resolve(__dirname, '..', '..', '..')
}

export const REPO_PATH = getRepositoryRootDir()
const PUBLIC_PATH = join(REPO_PATH, PUBLIC_DIR)
const DATA_PATH = join(REPO_PATH, 'data')
export const CMS_DATA_PATH = join(DATA_PATH, 'cms')
export const GENERATED_DATA_PATH = join(DATA_PATH, 'generated')
export const CONTENT_PATH = join(PUBLIC_PATH, CONTENTS_DIR)
export const PROJECTS_CONTENT_PATH = join(CONTENT_PATH, PROJECTS_DIR)
export const ALBUM_PRESETS_PATH = join(CMS_DATA_PATH, 'album-presets')
export const AUTHORS_PATH = join(CMS_DATA_PATH, 'authors')
export const SCRIPTS_CACHE_PATH = join(REPO_PATH, 'scripts', 'cache')
