import { Routes } from '@angular/router'
import { NotFoundPageComponent } from './not-found-page.component'
import { makeRouteMetadata } from '../common/routing/make-route-metadata'
import notFoundPageMetadata from '@/data/cms/pages/404.json'

export const NOT_FOUND_PAGE_ROUTES: Routes = [
  {
    path: '',
    component: NotFoundPageComponent,
    data: makeRouteMetadata(notFoundPageMetadata),
  },
]
