// app.routes.server.ts
import { RenderMode, ServerRoute } from '@angular/ssr'
import {
  CONTENTS_DIR,
  PROJECTS_DIR,
  PUBLIC_DIR,
} from '@/app/common/directories'
import { join } from 'path'
import { PROJECTS_PATH } from '@/app/common/routing/paths'
import { SLUG_PARAM } from '@/app/common/routes-params'
import { listJsonFilesInDirectory } from '@/app/common/json/json-file-utils'
import { removeJsonExtension } from '@/app/common/json/json-extension-utils'
import { REPO_ROOT_DIRECTORY } from '@/app/common/repo-root-directory'

export const serverRoutes: ServerRoute[] = [
  {
    path: `${PROJECTS_PATH}/:${SLUG_PARAM}`,
    renderMode: RenderMode.Prerender,
    getPrerenderParams: () => slugsInDirectory(PROJECTS_DIR),
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
]

const slugsInDirectory = async (
  directory: string,
): Promise<Record<string, string>[]> =>
  (
    await listJsonFilesInDirectory(
      join(REPO_ROOT_DIRECTORY, PUBLIC_DIR, CONTENTS_DIR, directory),
    )
  ).map((dirent) => ({ slug: removeJsonExtension(dirent.name) }))
