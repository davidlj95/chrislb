import { CUSTOM_ELEMENTS_SCHEMA, NgModule, VERSION } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { HeaderComponent } from './header/header.component'
import {
  APP_BASE_HREF,
  NgOptimizedImage,
  provideImageKitLoader,
} from '@angular/common'
import { LogoComponent } from './logo/logo.component'
import { register as registerSwiper } from 'swiper/element/bundle'
import { SwiperDirective } from './images-swiper/swiper.directive'
import { IMAGEKIT_URL } from './common/images/cdn-config'
import { SeoModule } from '@ngaox/seo'
import defaultMetadata from '../data/misc/metadata.json'
import { ProjectsPageComponent } from './projects/projects-page/projects-page.component'
import { ProjectListItemComponent } from './projects/projects-page/project-list-item/project-list-item.component'
import { ProjectPageComponent } from './projects/project-page/project-page.component'
import { NotFoundPageComponent } from './not-found-page/not-found-page.component'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { ImagesSwiperComponent } from './images-swiper/images-swiper.component'
import { JsonFetcher } from './common/json-fetcher/json-fetcher'
import { HttpJsonFetcherService } from './common/json-fetcher/http-json-fetcher.service'
import { HttpClientModule } from '@angular/common/http'
import { AboutPageComponent } from './about-page/about-page.component'
import { SocialComponent } from './about-page/social/social.component'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { ResumeComponent } from './about-page/resume/resume.component'
import { SanitizeResourceUrlPipe } from './common/sanitize-resource-url.pipe'

// There's no fancier way to install Web Components in Angular :P
// https://stackoverflow.com/a/75353889/3263250
registerSwiper()

@NgModule({
  declarations: [
    AppComponent,
    ProjectsPageComponent,
    HeaderComponent,
    ProjectListItemComponent,
    LogoComponent,
    SwiperDirective,
    ProjectPageComponent,
    NotFoundPageComponent,
    ImagesSwiperComponent,
    AboutPageComponent,
    SocialComponent,
    ResumeComponent,
    SanitizeResourceUrlPipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgOptimizedImage,
    BrowserAnimationsModule,
    HttpClientModule,
    FontAwesomeModule,
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
  // Use swiper web components
  // A better approach would be to declare those but there's no easy way
  // https://stackoverflow.com/a/43012920/3263250
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
