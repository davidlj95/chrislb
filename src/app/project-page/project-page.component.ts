import { Component, Input } from '@angular/core'
import { ProjectsService } from '../projects-page/projects.service'
import { displayNotFound } from '../common/navigation'
import { Router } from '@angular/router'
import { noop } from 'rxjs'
import { SeoService } from '@ngaox/seo'
import { getCanonicalUrlForPath, getTitle, PROJECTS_PATH } from '../routes'
import { ImageResponsiveBreakpointsService } from '../common/image-responsive-breakpoints.service'
import { ImageAsset } from '../../data/images/types'
import { ProjectImagesService } from './project-images.service'
import {
  DESIGN_BOOK_IMAGES_FILENAME,
  TECH_MATERIAL_IMAGES_FILENAME,
} from '../common/files'

@Component({
  selector: 'app-project-page',
  templateUrl: './project-page.component.html',
  styleUrls: ['./project-page.component.scss'],
})
export class ProjectPageComponent {
  @Input({ required: true })
  public set slug(slug: string) {
    this._slug = slug
    this.projectsService.bySlug(slug).then((projectItem) => {
      this.seo.setUrl(getCanonicalUrlForPath(PROJECTS_PATH, slug))
      if (!projectItem) {
        displayNotFound(this.router).then(noop)
        return
      }
      this.seo.setTitle(getTitle(projectItem.title))
      this.seo.setDescription(projectItem.description)
    })
    this.techMaterialImages = this.projectsImagesService.bySlugAndFilename(
      slug,
      TECH_MATERIAL_IMAGES_FILENAME,
    )
    this.designBookImages = this.projectsImagesService.bySlugAndFilename(
      slug,
      DESIGN_BOOK_IMAGES_FILENAME,
    )
  }

  protected _slug!: string

  public techMaterialImages!: Promise<ReadonlyArray<ImageAsset>>
  public designBookImages!: Promise<ReadonlyArray<ImageAsset>>
  public readonly HALF_SCREEN_SWIPER = {
    srcSet: this.imageResponsiveBreakpointsService
      .range(
        this.imageResponsiveBreakpointsService.MIN_SCREEN_WIDTH_PX,
        this.imageResponsiveBreakpointsService.MAX_SCREEN_WIDTH_PX / 2,
      )
      .toSrcSet(),
    customSwiperOptions: {
      slidesPerView: 1,
    },
    sizes: 'calc(50vw - 16px), calc(100vw - 16px)',
  }

  constructor(
    private projectsService: ProjectsService,
    private router: Router,
    private seo: SeoService,
    private projectsImagesService: ProjectImagesService,
    private imageResponsiveBreakpointsService: ImageResponsiveBreakpointsService,
  ) {}
}
