import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { HomePageComponent } from './home-page/home-page.component'
import { HeaderComponent } from './header/header.component'
import { ProjectsComponent } from './home-page/projects/projects.component'
import { ProjectItemComponent } from './home-page/projects/project-item/project-item.component'
import { NgOptimizedImage } from '@angular/common'
import { LogoComponent } from './logo/logo.component'

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    HeaderComponent,
    ProjectsComponent,
    ProjectItemComponent,
    LogoComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, NgOptimizedImage],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
