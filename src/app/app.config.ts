import {
  ApplicationConfig,
  provideZonelessChangeDetection,
} from '@angular/core'
import { APP_BASE_HREF } from '@angular/common'
import {
  ANGULAR_ROUTER_URL,
  GlobalMetadata,
  provideNgxMetaCore,
  withNgxMetaBaseUrl,
  withNgxMetaDefaults,
  withNgxMetaTitleFormatter,
} from '@davidlj95/ngx-meta/core'
import {
  OPEN_GRAPH_TYPE_WEBSITE,
  OpenGraphMetadata,
  provideNgxMetaOpenGraph,
} from '@davidlj95/ngx-meta/open-graph'
import {
  provideNgxMetaStandard,
  StandardMetadata,
} from '@davidlj95/ngx-meta/standard'
import { provideNgxMetaRouting } from '@davidlj95/ngx-meta/routing'
import {
  provideRouter,
  withComponentInputBinding,
  withEnabledBlockingInitialNavigation,
  withInMemoryScrolling,
} from '@angular/router'
import { routes } from './app.routes'
import { provideJsonFetcher } from '@/app/common/json/fetcher/json-fetcher'
import { HTTP_JSON_FETCHER } from '@/app/common/json/fetcher/http-json-fetcher'
import { provideHttpClient } from '@angular/common/http'
import defaultMetadata from '@/data/cms/misc/metadata.json'
import { provideTrailingSlashUrlSerializer } from './common/provide-trailing-slash-url-serializer'
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async'
import { provideResponsiveImageLoader } from './common/images/cdn'

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withEnabledBlockingInitialNavigation(),
      withComponentInputBinding(),
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled' }),
    ),
    provideTrailingSlashUrlSerializer(),
    provideResponsiveImageLoader(),
    provideJsonFetcher(HTTP_JSON_FETCHER),
    { provide: APP_BASE_HREF, useValue: '/' },
    provideNgxMetaCore(
      withNgxMetaDefaults({
        canonicalUrl: ANGULAR_ROUTER_URL,
        locale: 'en',
        standard: {
          author: defaultMetadata.author,
          generator: true,
        },
        openGraph: {
          siteName: defaultMetadata.siteName,
          type: OPEN_GRAPH_TYPE_WEBSITE,
        },
      } satisfies GlobalMetadata & StandardMetadata & OpenGraphMetadata),
      withNgxMetaBaseUrl(defaultMetadata.canonicalUrl),
      withNgxMetaTitleFormatter((title) => {
        if (!title?.trim()) {
          return defaultMetadata.siteName
        }
        return `${title} | ${defaultMetadata.siteName}`
      }),
    ),
    provideNgxMetaRouting(),
    provideNgxMetaStandard(),
    provideNgxMetaOpenGraph(),
    provideAnimationsAsync(),
    provideHttpClient(),
    provideZonelessChangeDetection(),
  ],
}
