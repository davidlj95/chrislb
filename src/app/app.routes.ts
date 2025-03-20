import { Routes } from '@angular/router'
import { PROJECTS_ROUTES } from './projects/projects.routes'
import { ABOUT_PATH } from './common/routing/paths'
import { NOT_FOUND_PAGE_ROUTES } from './not-found-page/not-found-page.routes'

export const routes: Routes = [
  ...PROJECTS_ROUTES,
  {
    path: ABOUT_PATH,
    loadChildren: () =>
      import('./about-page/about-page.routes').then((m) => m.ABOUT_ROUTES),
  },
  ...NOT_FOUND_PAGE_ROUTES,
]
