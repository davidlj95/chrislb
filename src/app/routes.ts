import { Router, Routes } from '@angular/router'
import { ProjectPageComponent } from './project-page/project-page.component'
import { ProjectsPageComponent } from './projects-page/projects-page.component'
import { NotFoundPageComponent } from './not-found-page/not-found-page.component'
import { IPageSeoData } from '@ngaox/seo'
import meta from '../data/meta.json'

const PROJECTS_PATH = 'projects'
const NOT_FOUND_DATA: RouteData = {
  NgaoxSeo: {
    title: getTitle(meta.notFound.title),
    description: meta.notFound.description,
    image: undefined,
  },
}
const NOT_FOUND_PATH = '404'
export const ROUTES: Routes = [
  {
    path: '',
    component: ProjectsPageComponent,
    data: {
      NgaoxSeo: {
        title: meta.default.siteName,
        description: meta.default.description,
        keywords: meta.default.keywords,
        url: getCanonicalUrlForPath(''),
      },
    },
    pathMatch: 'full',
  },
  {
    path: `${PROJECTS_PATH}/:slug`,
    component: ProjectPageComponent,
  },
  {
    path: NOT_FOUND_PATH,
    component: NotFoundPageComponent,
    data: {
      NOT_FOUND_DATA,
      url: getCanonicalUrlForPath(NOT_FOUND_PATH),
    },
  },
  {
    path: '**',
    component: NotFoundPageComponent,
    data: NOT_FOUND_DATA,
  },
]
type RouteData = { NgaoxSeo?: IPageSeoData }

export function getCanonicalUrlForPath(path: string) {
  return new URL(path, new URL(meta.default.canonicalUrl)).toString()
}

function getTitle(title: string) {
  return `${title} | ${meta.default.siteName}`
}

export function displayNotFound(router: Router) {
  return router.navigate([NOT_FOUND_PATH], { skipLocationChange: true })
}
