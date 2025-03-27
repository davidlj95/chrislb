import { Routes } from '@angular/router'
import { ABOUT_PATH, PROJECTS_PATH } from './common/routing/paths'

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadChildren: () =>
      import('./projects/projects.routes').then((m) => m.PROJECTS_LIST_ROUTES),
  },
  {
    path: PROJECTS_PATH,
    loadChildren: () =>
      import('./projects/projects.routes').then((m) => m.PROJECTS_ROUTES),
  },
  {
    path: ABOUT_PATH,
    loadChildren: () =>
      import('./about-page/about-page.routes').then((m) => m.ABOUT_ROUTES),
  },
  {
    path: '**',
    loadChildren: () =>
      import('./not-found-page/not-found-page.routes').then(
        (m) => m.NOT_FOUND_PAGE_ROUTES,
      ),
  },
]
