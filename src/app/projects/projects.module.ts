import { NgModule } from '@angular/core'
import { CommonModule, NgOptimizedImage } from '@angular/common'
import { RouterModule } from '@angular/router'

import { SwiperDirective } from './images-swiper/swiper.directive'
import { ImagesSwiperComponent } from './images-swiper/images-swiper.component'
import { ProjectsPageComponent } from './projects-page/projects-page.component'
import { ProjectListItemComponent } from './projects-page/project-list-item/project-list-item.component'
import { ProjectPageComponent } from './project-page/project-page.component'
import { SanitizeResourceUrlPipe } from './sanitize-resource-url.pipe'
import { ProjectsService } from './projects.service'
import { ProjectAssetsCollectionsService } from './project-page/project-assets-collections.service'
import { ProjectPageResolver } from './project-page/project-page.resolver'

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    NgOptimizedImage,
    ProjectsPageComponent,
    ProjectListItemComponent,
    ProjectPageComponent,
    ImagesSwiperComponent,
    SwiperDirective,
    SanitizeResourceUrlPipe,
  ],
  exports: [ProjectsPageComponent, ProjectPageComponent],
  providers: [
    ProjectsService,
    ProjectAssetsCollectionsService,
    ProjectPageResolver,
  ],
})
export class ProjectsModule {}
