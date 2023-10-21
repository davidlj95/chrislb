import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { HomePageComponent } from './home-page/home-page.component'
import { HeaderComponent } from './header/header.component'
import { ProjectsComponent } from './home-page/projects/projects.component'
import { ProjectItemComponent } from './home-page/projects/project-item/project-item.component'
import { NgOptimizedImage, provideCloudinaryLoader } from '@angular/common'
import { LogoComponent } from './logo/logo.component'
import { register as registerSwiper } from 'swiper/element/bundle'
import { SwiperDirective } from './common/swiper.directive'
import { HttpClientModule } from '@angular/common/http'

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
  ],
  providers: [provideCloudinaryLoader('https://res.cloudinary.com/chrislb')],
  bootstrap: [AppComponent],
  // Use swiper web components
  // A better approach would be to declare those but there's no easy way
  // https://stackoverflow.com/a/43012920/3263250
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
