import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core'
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

@NgModule({
  declarations: [
    ProjectsPageComponent,
    ProjectListItemComponent,
    ProjectPageComponent,
    ImagesSwiperComponent,
    SwiperDirective,
    SanitizeResourceUrlPipe,
  ],
  imports: [CommonModule, RouterModule, NgOptimizedImage],
  exports: [ProjectsPageComponent, ProjectPageComponent],
  // Use swiper web components
  // A better approach would be to declare those but there's no easy way
  // https://stackoverflow.com/a/43012920/3263250
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [ProjectsService, ProjectAssetsCollectionsService],
})
export class ProjectsModule {}
