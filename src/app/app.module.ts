import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { HomePageComponent } from './home-page/home-page.component'
import { HeaderComponent } from './home-page/header/header.component'
import { ProjectsComponent } from './home-page/projects/projects.component'
import { ProjectItemComponent } from './home-page/projects/project-item/project-item.component'
import { NgOptimizedImage } from '@angular/common'

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    HeaderComponent,
    ProjectsComponent,
    ProjectItemComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, NgOptimizedImage],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
