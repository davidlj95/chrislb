import { Component, Input } from '@angular/core'
import { ProjectsService } from '../projects.service'
import { catchError, concatMap, Observable, of, tap } from 'rxjs'
import { SeoService } from '@ngaox/seo'
import { getCanonicalUrlForPath, getTitle, PROJECTS_PATH } from '../../routes'
import { ImageResponsiveBreakpointsService } from '../../common/image-responsive-breakpoints.service'
import { ImageResponsiveBreakpoints } from '../../common/image-responsive-breakpoints'
import { NavigatorService } from '../../common/navigator.service'
import { AnyAssetsCollection } from './any-asset-collection'
import { ProjectAssetsCollectionsService } from './project-assets-collections.service'
import { SwiperOptions } from 'swiper/types'
import { AssetsCollection } from './assets-collection'

@Component({
  selector: 'app-project-page',
  templateUrl: './project-page.component.html',
  styleUrls: ['./project-page.component.scss'],
})
export class ProjectPageComponent {
  public assetsCollections$!: Observable<ReadonlyArray<AnyAssetsCollection>>
  public readonly FULL_SCREEN_SWIPER_MAX_WIDTH = 850
  public readonly FULL_SCREEN_SWIPER_SLIDES_PER_VIEW = 2
  public readonly SWIPER_MAX_SLIDE_WIDTH_PX =
    this.FULL_SCREEN_SWIPER_MAX_WIDTH / this.FULL_SCREEN_SWIPER_SLIDES_PER_VIEW
  protected readonly MAX_SWIPERS_PER_VIEWPORT = 2
  protected readonly IMAGE_ASSETS_SWIPER_CONFIG_BY_NAME: {
    [k in AssetsCollection['size']]: ImageAssetsSwiperConfig
  } = {
    half: {
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
    },
    full: {
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
      maxWidthPx: this.FULL_SCREEN_SWIPER_MAX_WIDTH,
    },
  }

  constructor(
    private projectsService: ProjectsService,
    private seo: SeoService,
    private navigatorService: NavigatorService,
    private projectAssetsCollectionsService: ProjectAssetsCollectionsService,
    private imageResponsiveBreakpointsService: ImageResponsiveBreakpointsService,
  ) {}

  @Input({ required: true })
  public set slug(slug: string) {
    const project$ = this.projectsService.bySlug(slug).pipe(
      tap({
        next: (project) => {
          this.seo.setUrl(getCanonicalUrlForPath(PROJECTS_PATH, slug))
          this.seo.setTitle(getTitle(project.title))
          this.seo.setDescription(project.description)
        },
        error: () => {
          this.navigatorService.displayNotFoundPage()
        },
      }),
    )
    this.assetsCollections$ = project$.pipe(
      concatMap((project) =>
        this.projectAssetsCollectionsService
          .byProject(project)
          .pipe(catchError(() => of([]))),
      ),
      tap((assetsCollections) => {
        if (assetsCollections.length === 0) {
          this.navigatorService.displayNotFoundPage()
        }
      }),
    )
  }
}

interface ImageAssetsSwiperConfig {
  readonly customSwiperOptions: SwiperOptions
  readonly srcSet: string
  readonly sizes: string
  readonly maxWidthPx?: number
}
