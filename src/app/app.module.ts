import { CUSTOM_ELEMENTS_SCHEMA, NgModule, VERSION } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { ProjectsPageComponent } from './projects-page/projects-page.component'
import { HeaderComponent } from './header/header.component'
import { ProjectItemComponent } from './projects-page/project-item/project-item.component'
import { NgOptimizedImage, provideImageKitLoader } from '@angular/common'
import { LogoComponent } from './logo/logo.component'
import { register as registerSwiper } from 'swiper/element/bundle'
import { SwiperDirective } from './image-swiper/swiper.directive'
import { IMAGEKIT_URL } from '../data/images/config' // There's no fancier way to install Web Components in Angular :P
import { SeoModule } from '@ngaox/seo'
import meta from '../data/meta.json'
import { ProjectPageComponent } from './project-page/project-page.component'
import { NotFoundPageComponent } from './not-found-page/not-found-page.component'
import { getCanonicalUrlForPath } from './routes'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { LookbooksComponent } from './project-page/lookbooks/lookbooks.component'
import { LookbookComponent } from './project-page/lookbooks/lookbook/lookbook.component'
import { TechMaterialComponent } from './project-page/tech-material/tech-material.component'
import { ImageSwiperComponent } from './image-swiper/image-swiper.component'

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
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgOptimizedImage,
    BrowserAnimationsModule,
    SeoModule.forRoot({
      type: 'website',
      image: {
        url: getCanonicalUrlForPath('assets/favicons/open-graph.png'),
        alt: meta.default.imageAlt,
        width: 875,
        height: 875,
        // I wouldn't set it, but if I don't set it, then it appears as "undefined" :(
        mimeType: 'image/png',
      },
      twitter: {
        card: 'summary',
      },
      siteName: meta.default.siteName,
      extra: [
        { name: 'author', content: meta.default.author },
        { property: 'og:locale', content: 'en' },
        { name: 'generator', content: `Angular ${VERSION.full}` },
        // See more in favicons doc. Related to Internet Explorer / Microsoft metro tiles
        { name: 'application-name', content: meta.default.siteName },
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
