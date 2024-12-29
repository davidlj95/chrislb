import { Routes } from '@angular/router'
import { AboutPageComponent } from './about-page.component'
import { makeRouteMetadata } from '../common/routing/make-route-metadata'
import aboutPageMetadata from '../../data/pages/about.json'
import {
  OPEN_GRAPH_TYPE_PROFILE,
  provideNgxMetaOpenGraphProfile,
} from '@davidlj95/ngx-meta/open-graph'
import aboutPageContents from '../../data/misc/about.json'
import { provideNgxMetaMetadataLoader } from '@davidlj95/ngx-meta/core'

export const ABOUT_ROUTES: Routes = [
  {
    path: '',
    component: AboutPageComponent,
    data: makeRouteMetadata({
      ...aboutPageMetadata,
      openGraphType: OPEN_GRAPH_TYPE_PROFILE,
      openGraphProfile: aboutPageContents.openGraphProfile,
    }),
    providers: [
      provideNgxMetaOpenGraphProfile(),
      provideNgxMetaMetadataLoader(),
    ],
  },
]
