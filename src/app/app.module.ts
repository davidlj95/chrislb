import { CUSTOM_ELEMENTS_SCHEMA, NgModule, VERSION } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { ProjectsPageComponent } from './projects-page/projects-page.component'
import { HeaderComponent } from './header/header.component'
import { ProjectItemComponent } from './projects-page/project-item/project-item.component'
import {
  APP_BASE_HREF,
  NgOptimizedImage,
  provideImageKitLoader,
} from '@angular/common'
import { LogoComponent } from './logo/logo.component'
import { register as registerSwiper } from 'swiper/element/bundle'
import { SwiperDirective } from './image-swiper/swiper.directive'
import { IMAGEKIT_URL } from '../data/images/config' // There's no fancier way to install Web Components in Angular :P
import { SeoModule } from '@ngaox/seo'
import defaultMetadata from '../data/metadata/default.json'
import { ProjectPageComponent } from './project-page/project-page.component'
import { NotFoundPageComponent } from './not-found-page/not-found-page.component'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { LookbooksComponent } from './project-page/lookbooks/lookbooks.component'
import { LookbookComponent } from './project-page/lookbooks/lookbook/lookbook.component'
import { TechMaterialComponent } from './project-page/tech-material/tech-material.component'
import { ImageSwiperComponent } from './image-swiper/image-swiper.component'
import { DesignBookComponent } from './project-page/design-book/design-book.component'
import { JsonFetcher } from './common/json-fetcher/json-fetcher'
import { HttpJsonFetcherService } from './common/json-fetcher/http-json-fetcher.service'
import { HttpClientModule } from '@angular/common/http'

// There's no fancier way to install Web Components in Angular :P
// https://stackoverflow.com/a/75353889/3263250
registerSwiper()

@NgModule({
  declarations: [
    AppComponent,
    ProjectsPageComponent,
    HeaderComponent,
    ProjectItemComponent,
    LogoComponent,
    SwiperDirective,
    ProjectPageComponent,
    NotFoundPageComponent,
    LookbooksComponent,
    LookbookComponent,
    TechMaterialComponent,
    ImageSwiperComponent,
    DesignBookComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgOptimizedImage,
    BrowserAnimationsModule,
    HttpClientModule,
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
