import { Routes } from '@angular/router'
import { NOT_FOUND_PATH } from '../common/routing/paths'
import { NotFoundPageComponent } from './not-found-page.component'
import { makeRouteMetadata } from '../common/routing/make-route-metadata'
import notFoundPageMetadata from '../../../data/cms/pages/404.json'

export const NOT_FOUND_PAGE_ROUTES: Routes = [
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
