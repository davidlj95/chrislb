import { NgModule, VERSION } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { HttpClientModule } from '@angular/common/http'
import {
  APP_BASE_HREF,
  NgOptimizedImage,
  provideImageKitLoader,
} from '@angular/common'
import { SeoModule } from '@ngaox/seo'

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
    SeoModule.forRoot({
      type: 'website',
      twitter: {
        card: 'summary',
      },
      siteName: defaultMetadata.siteName,
      extra: [
        { name: 'author', content: defaultMetadata.author },
        { property: 'og:locale', content: 'en' },
        { name: 'generator', content: `Angular ${VERSION.full}` },
        // See more in favicons doc. Related to Internet Explorer / Microsoft metro tiles
        { name: 'application-name', content: defaultMetadata.siteName },
      ],
    }),
  ],
  providers: [
    provideImageKitLoader(IMAGEKIT_URL),
    { provide: JsonFetcher, useClass: HttpJsonFetcherService },
    { provide: APP_BASE_HREF, useValue: '/' },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
