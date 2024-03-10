import { ApplicationConfig, importProvidersFrom } from '@angular/core'
import { APP_BASE_HREF, provideImageKitLoader } from '@angular/common'
import { GlobalMetadata, NgxMetaCoreModule } from '@davidlj95/ngx-meta/core'
import {
  NgxMetaOpenGraphModule,
  OPEN_GRAPH_TYPE_WEBSITE,
  OpenGraphMetadata,
} from '@davidlj95/ngx-meta/open-graph'
import {
  NgxMetaStandardModule,
  StandardMetadata,
} from '@davidlj95/ngx-meta/standard'
import { NgxMetaRoutingModule } from '@davidlj95/ngx-meta/routing'
import {
  provideRouter,
  withComponentInputBinding,
  withEnabledBlockingInitialNavigation,
  withInMemoryScrolling,
} from '@angular/router'
import { routes } from './app.routes'
import { IMAGEKIT_URL } from './common/images/cdn-config'
import { JsonFetcher } from './common/json-fetcher/json-fetcher'
import { HttpJsonFetcherService } from './common/json-fetcher/http-json-fetcher.service'
import { provideAnimations } from '@angular/platform-browser/animations'
import { provideHttpClient } from '@angular/common/http'
import defaultMetadata from '../data/misc/metadata.json'

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(
      NgxMetaCoreModule.forRoot({
        defaults: {
          locale: 'en',
          standard: {
            author: defaultMetadata.author,
            generator: true,
          },
          openGraph: {
            siteName: defaultMetadata.siteName,
            type: OPEN_GRAPH_TYPE_WEBSITE,
          },
        } satisfies GlobalMetadata & StandardMetadata & OpenGraphMetadata,
      }),
      NgxMetaRoutingModule.forRoot(),
      NgxMetaStandardModule,
      NgxMetaOpenGraphModule,
    ),
    provideRouter(
      routes,
      withEnabledBlockingInitialNavigation(),
      withComponentInputBinding(),
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled' }),
    ),
    provideImageKitLoader(IMAGEKIT_URL),
    { provide: JsonFetcher, useClass: HttpJsonFetcherService },
    { provide: APP_BASE_HREF, useValue: '/' },
    provideAnimations(),
    provideHttpClient(),
  ],
}
