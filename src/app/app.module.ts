import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { HttpClientModule } from '@angular/common/http'
import {
  APP_BASE_HREF,
  NgOptimizedImage,
  provideImageKitLoader,
} from '@angular/common'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { HeaderComponent } from './header/header.component'
import { LogoComponent } from './logo/logo.component'
import { IMAGEKIT_URL } from './common/images/cdn-config'
import defaultMetadata from '../data/misc/metadata.json'
import { NotFoundPageComponent } from './not-found-page/not-found-page.component'
import { JsonFetcher } from './common/json-fetcher/json-fetcher'
import { HttpJsonFetcherService } from './common/json-fetcher/http-json-fetcher.service'
import { ProjectsModule } from './projects/projects.module'
import { NgxMetaRoutingModule } from '@davidlj95/ngx-meta/routing'
import { NgxMetaStandardModule } from '@davidlj95/ngx-meta/standard'
import { GlobalMetadata, NgxMetaCoreModule } from '@davidlj95/ngx-meta/core'
import { StandardMetadata } from '@davidlj95/ngx-meta/standard/src/standard-metadata'
import {
  NgxMetaOpenGraphModule,
  OpenGraphMetadata,
  OpenGraphType,
} from '@davidlj95/ngx-meta/open-graph'

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LogoComponent,
    NotFoundPageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgOptimizedImage,
    BrowserAnimationsModule,
    HttpClientModule,
    ProjectsModule,
    NgxMetaCoreModule.withDefaults({
      locale: 'en',
      standard: {
        author: defaultMetadata.author,
        generator: true,
      },
      openGraph: {
        siteName: defaultMetadata.siteName,
        type: OpenGraphType.Website,
      },
    } satisfies GlobalMetadata & {
      standard: StandardMetadata
      openGraph: OpenGraphMetadata
    }),
    NgxMetaRoutingModule.forRoot(),
    NgxMetaStandardModule,
    NgxMetaOpenGraphModule,
  ],
  providers: [
    provideImageKitLoader(IMAGEKIT_URL),
    { provide: JsonFetcher, useClass: HttpJsonFetcherService },
    { provide: APP_BASE_HREF, useValue: '/' },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
