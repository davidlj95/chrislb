import { Component, Input } from '@angular/core'
import { ProjectsService } from '../projects-page/projects.service'
import { displayNotFound } from '../common/navigation'
import { Router } from '@angular/router'
import { noop } from 'rxjs'
import { SeoService } from '@ngaox/seo'
import { getCanonicalUrlForPath, getTitle, PROJECTS_PATH } from '../routes'
import { ImageResponsiveBreakpointsService } from '../common/image-responsive-breakpoints.service'
import { ImageAsset } from '../common/images/types'
import { ProjectImagesService } from './project-images.service'
import {
  DESIGN_BOOK_IMAGES_FILENAME,
  TECH_MATERIAL_IMAGES_FILENAME,
} from '../common/files'
import { Lookbook } from './lookbook'
import { ProjectLookbooksService } from './project-lookbooks.service'
import { ImageResponsiveBreakpoints } from '../common/image-responsive-breakpoints'

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
    this.lookbooks = this.projectLookbooksService.bySlug(slug)
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

  public lookbooks!: Promise<ReadonlyArray<Lookbook>>
  protected readonly MAX_LOOKBOOKS_PER_VIEWPORT = 2
  public techMaterialImages!: Promise<ReadonlyArray<ImageAsset>>
  public designBookImages!: Promise<ReadonlyArray<ImageAsset>>
  public readonly HALF_SCREEN_SWIPER = {
    customSwiperOptions: {
      slidesPerView: 1,
    },
    srcSet: this.imageResponsiveBreakpointsService
      .range(
        this.imageResponsiveBreakpointsService.MIN_SCREEN_WIDTH_PX,
        this.imageResponsiveBreakpointsService.MAX_SCREEN_WIDTH_PX / 2,
      )
      .toSrcSet(),
    sizes: 'calc(50vw - 16px), calc(100vw - 16px)',
  }
  public readonly LOOKBOOK_MAX_WIDTH_PX = 850
  public readonly LOOKBOOK_SLIDES_PER_VIEW = 2
  public readonly LOOKBOOK_MAX_SLIDE_WIDTH_PX =
    this.LOOKBOOK_MAX_WIDTH_PX / this.LOOKBOOK_SLIDES_PER_VIEW
  public readonly LOOKBOOK_SWIPER = {
    customSwiperOptions: {
      slidesPerView: this.LOOKBOOK_SLIDES_PER_VIEW,
    },
    srcSet: new ImageResponsiveBreakpoints(
      this.imageResponsiveBreakpointsService
        .range(
          this.imageResponsiveBreakpointsService.MIN_SCREEN_WIDTH_PX / 2,
          this.LOOKBOOK_MAX_SLIDE_WIDTH_PX,
        )
        .pxValues.concat([this.LOOKBOOK_MAX_SLIDE_WIDTH_PX]),
    ).toSrcSet(),
    sizes: `calc(50vw - 16px), ${this.LOOKBOOK_MAX_SLIDE_WIDTH_PX}px`,
  }

  constructor(
    private projectsService: ProjectsService,
    private router: Router,
    private seo: SeoService,
    private projectLookbooksService: ProjectLookbooksService,
    private projectsImagesService: ProjectImagesService,
    private imageResponsiveBreakpointsService: ImageResponsiveBreakpointsService,
  ) {}
}
