import { Routes } from '@angular/router'
import { AboutPageComponent } from './about-page.component'
import aboutPageMetadata from '@/data/cms/pages/about.json'
import {
  OPEN_GRAPH_TYPE_PROFILE,
  OpenGraphMetadata,
  provideNgxMetaOpenGraphProfile,
} from '@davidlj95/ngx-meta/open-graph'
import aboutPageContents from '@/data/cms/misc/about.json'
import { provideNgxMetaMetadataLoader } from '@davidlj95/ngx-meta/core'
import { NgxMetaRouteData } from '@davidlj95/ngx-meta/routing'

export const ABOUT_ROUTES: Routes = [
  {
    path: '',
    component: AboutPageComponent,
    data: {
      meta: {
        ...aboutPageMetadata,
        openGraph: {
          type: OPEN_GRAPH_TYPE_PROFILE,
          profile: aboutPageContents.openGraphProfile,
        },
      },
    } satisfies NgxMetaRouteData<OpenGraphMetadata>,
    providers: [
      provideNgxMetaOpenGraphProfile(),
      provideNgxMetaMetadataLoader(),
    ],
  },
]
