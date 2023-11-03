import { Component, Input } from '@angular/core'
import { ProjectsService } from '../projects-page/projects.service'
import { displayNotFound } from '../common/navigation'
import { Router } from '@angular/router'
import {
  catchError,
  EMPTY,
  finalize,
  map,
  merge,
  noop,
  Observable,
  tap,
} from 'rxjs'
import { SeoService } from '@ngaox/seo'
import { getCanonicalUrlForPath, getTitle, PROJECTS_PATH } from '../routes'
import { ImageResponsiveBreakpointsService } from '../common/image-responsive-breakpoints.service'
import { ImageAsset } from '../common/images/types'
import { ProjectImagesService } from './project-images.service'
import {
  CONCEPT_IMAGES_FILENAME,
  DESIGN_BOOK_IMAGES_FILENAME,
  TECH_MATERIAL_IMAGES_FILENAME,
} from '../common/files'
import { Lookbook } from './lookbook'
import { ProjectLookbooksService } from './project-lookbooks.service'
import { ImageResponsiveBreakpoints } from '../common/image-responsive-breakpoints'
import { DomSanitizer, SafeUrl } from '@angular/platform-browser'

@Component({
  selector: 'app-project-page',
  templateUrl: './project-page.component.html',
  styleUrls: ['./project-page.component.scss'],
})
export class ProjectPageComponent {
  @Input({ required: true })
  public set slug(slug: string) {
    this.projectsService.bySlug(slug).then((projectItem) => {
      if (projectItem.youtubePlaylistId) {
        this.youtubePlaylistId = projectItem.youtubePlaylistId
      }
      this.seo.setUrl(getCanonicalUrlForPath(PROJECTS_PATH, slug))
      if (!projectItem) {
        displayNotFound(this.router).then(noop)
        return
      }
      this.seo.setTitle(getTitle(projectItem.title))
      this.seo.setDescription(projectItem.description)
    })
    this.data$ = merge(
      this.projectLookbooksService.bySlug(slug).pipe(
        map((lookbooks) => ({ ...this.lastData, lookbooks })),
        catchError(() => EMPTY),
      ),
      this.projectsImagesService
        .bySlugAndFilename(slug, TECH_MATERIAL_IMAGES_FILENAME)
        .pipe(
          map((techMaterialImages) => ({
            ...this.lastData,
            techMaterialImages,
          })),
          catchError(() => EMPTY),
        ),
      this.projectsImagesService
        .bySlugAndFilename(slug, DESIGN_BOOK_IMAGES_FILENAME)
        .pipe(
          map((designBookImages) => ({ ...this.lastData, designBookImages })),
          catchError(() => EMPTY),
        ),
      this.projectsImagesService
        .bySlugAndFilename(slug, CONCEPT_IMAGES_FILENAME)
        .pipe(
          map((conceptImages) => ({ ...this.lastData, conceptImages })),
          catchError(() => EMPTY),
        ),
    ).pipe(
      tap((data) => {
        this.lastData = data
      }),
      finalize(() => {
        if (
          !this.youtubeIframeUrl &&
          !this.lastData?.lookbooks?.length &&
          !this.lastData?.techMaterialImages?.length &&
          !this.lastData?.designBookImages?.length &&
          !this.lastData?.conceptImages?.length
        ) {
          displayNotFound(this.router).then(noop)
        }
      }),
    )
  }

  public youtubeIframeUrl?: SafeUrl

  public set youtubePlaylistId(playlistId: string) {
    const youtubeIframeUrl = new URL(
      'https://www.youtube-nocookie.com/embed?listType=playlist&&loop=true',
    )
    youtubeIframeUrl.searchParams.set('list', playlistId)
    this.youtubeIframeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      youtubeIframeUrl.toString(),
    )
  }

  public data$!: Observable<ViewModel>
  private lastData?: ViewModel
  protected readonly MAX_SWIPERS_PER_VIEWPORT = 2
  public readonly FULL_SCREEN_SWIPER_MAX_WIDTH = 850
  public readonly FULL_SCREEN_SWIPER_SLIDES_PER_VIEW = 2
  public readonly SWIPER_MAX_SLIDE_WIDTH_PX =
    this.FULL_SCREEN_SWIPER_MAX_WIDTH / this.FULL_SCREEN_SWIPER_SLIDES_PER_VIEW
  public readonly FULL_SCREEN_SWIPER = {
    customSwiperOptions: {
      slidesPerView: this.FULL_SCREEN_SWIPER_SLIDES_PER_VIEW,
    },
    srcSet: new ImageResponsiveBreakpoints(
      this.imageResponsiveBreakpointsService
        .range(
          this.imageResponsiveBreakpointsService.MIN_SCREEN_WIDTH_PX / 2,
          this.SWIPER_MAX_SLIDE_WIDTH_PX,
        )
        .pxValues.concat([this.SWIPER_MAX_SLIDE_WIDTH_PX]),
    ).toSrcSet(),
    sizes: `calc(50vw - 16px), ${this.SWIPER_MAX_SLIDE_WIDTH_PX}px`,
  }
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

  constructor(
    private projectsService: ProjectsService,
    private router: Router,
    private seo: SeoService,
    private projectLookbooksService: ProjectLookbooksService,
    private projectsImagesService: ProjectImagesService,
    private imageResponsiveBreakpointsService: ImageResponsiveBreakpointsService,
    private sanitizer: DomSanitizer,
  ) {}
}

interface ViewModel {
  readonly lookbooks?: ReadonlyArray<Lookbook>
  readonly techMaterialImages?: ReadonlyArray<ImageAsset>
  readonly designBookImages?: ReadonlyArray<ImageAsset>
  readonly conceptImages?: ReadonlyArray<ImageAsset>
}
