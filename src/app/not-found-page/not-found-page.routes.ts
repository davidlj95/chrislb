import { Routes } from '@angular/router'
import { NotFoundPageComponent } from './not-found-page.component'
import notFoundPageMetadata from '@/data/cms/pages/404.json'
import { NgxMetaRouteData } from '@davidlj95/ngx-meta/routing'
import { GlobalMetadata } from '@davidlj95/ngx-meta/core'

export const NOT_FOUND_PAGE_ROUTES: Routes = [
  {
    path: '',
    component: NotFoundPageComponent,
    data: {
      meta: { ...notFoundPageMetadata, canonicalUrl: null },
    } satisfies NgxMetaRouteData<GlobalMetadata>,
  },
]
