import { ProjectsListPageComponent } from './projects/projects-list-page/projects-list-page.component'
import { NotFoundPageComponent } from './not-found-page/not-found-page.component'
import projectsListPageMetadata from '../data/pages/projects-list.json'
import notFoundPageMetadata from '../data/pages/404.json'
import { makeRouteMetadata } from './common/routing/make-route-metadata'
import {
  ABOUT_PATH,
  NOT_FOUND_PATH,
  PROJECTS_PATH,
} from './common/routing/paths'
import { PROJECTS_ROUTES } from './projects/projects.routes'
import { Routes } from '@angular/router'

export const routes: Routes = [
  {
    path: '',
    component: ProjectsListPageComponent,
    data: makeRouteMetadata(projectsListPageMetadata),
    pathMatch: 'full',
  },
  {
    path: PROJECTS_PATH,
    children: PROJECTS_ROUTES,
  },
  {
    path: ABOUT_PATH,
    loadChildren: () =>
      import('./about-page/about-page.routes').then((m) => m.ABOUT_ROUTES),
  },
  {
    path: NOT_FOUND_PATH,
    component: NotFoundPageComponent,
    data: makeRouteMetadata(notFoundPageMetadata),
  },
  {
    path: '**',
    component: NotFoundPageComponent,
    data: makeRouteMetadata(notFoundPageMetadata, [NOT_FOUND_PATH]),
  },
]
