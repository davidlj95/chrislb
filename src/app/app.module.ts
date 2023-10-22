import { CUSTOM_ELEMENTS_SCHEMA, NgModule, VERSION } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { HomePageComponent } from './home-page/home-page.component'
import { HeaderComponent } from './header/header.component'
import { ProjectsComponent } from './home-page/projects/projects.component'
import { ProjectItemComponent } from './home-page/projects/project-item/project-item.component'
import { NgOptimizedImage, provideImageKitLoader } from '@angular/common'
import { LogoComponent } from './logo/logo.component'
import { register as registerSwiper } from 'swiper/element/bundle'
import { SwiperDirective } from './common/swiper.directive'
import { HttpClientModule } from '@angular/common/http'
import { IMAGEKIT_URL } from '../data/images/config' // There's no fancier way to install Web Components in Angular :P
import { SeoModule } from '@ngaox/seo'
import meta from '../data/meta.json'

// There's no fancier way to install Web Components in Angular :P
// https://stackoverflow.com/a/75353889/3263250
registerSwiper()

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    HeaderComponent,
    ProjectsComponent,
    ProjectItemComponent,
    LogoComponent,
    SwiperDirective,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgOptimizedImage,
    HttpClientModule,
    SeoModule.forRoot({
      title: meta.siteName,
      keywords: meta.keywords,
      description: meta.description,
      url: meta.canonicalUrl,
      type: 'website',
      image: {
        url: new URL('assets/img/open_graph.png', meta.canonicalUrl).toString(),
        alt: meta.imageAlt,
        width: 875,
        height: 875,
        // I wouldn't set it, but if I don't set it, then it appears as "undefined" :(
        mimeType: 'image/png',
      },
      twitter: {
        card: 'summary',
        creator: meta.author,
        site: meta.siteName,
      },
      siteName: meta.siteName,
      extra: [
        { name: 'author', content: meta.author },
        { property: 'og:locale', content: 'en' },
        { name: 'generator', content: `Angular ${VERSION.full}` },
        // See more in favicons doc. Related to Internet Explorer / Microsoft metro tiles
        { name: 'application-name', content: meta.siteName },
      ],
    }),
  ],
  providers: [provideImageKitLoader(IMAGEKIT_URL)],
  bootstrap: [AppComponent],
  // Use swiper web components
  // A better approach would be to declare those but there's no easy way
  // https://stackoverflow.com/a/43012920/3263250
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
