// app.routes.server.ts
import { RenderMode, ServerRoute } from '@angular/ssr'
import {
  CONTENTS_DIR,
  PROJECTS_DIR,
  PUBLIC_DIR,
} from '@/app/common/directories'
import { basename, join } from 'path'
import { cwd } from 'process'
import { readdir } from 'fs/promises'

export const serverRoutes: ServerRoute[] = [
  {
    path: 'projects/:slug',
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
  (await readdir(join(cwd(), PUBLIC_DIR, CONTENTS_DIR, directory))).map(
    (file) => ({ slug: basename(file, '.json') }),
  )
