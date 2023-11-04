import { Component, DestroyRef, Input } from '@angular/core'
import { ProjectsService } from '../projects-page/projects.service'
import { displayNotFound } from '../common/navigation'
import { Router } from '@angular/router'
import {
  catchError,
  combineLatest,
  concatMap,
  last,
  map,
  noop,
  Observable,
  of,
  share,
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
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'
import { YoutubePlaylist } from './youtube-playlist'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'

@Component({
  selector: 'app-project-page',
  templateUrl: './project-page.component.html',
  styleUrls: ['./project-page.component.scss'],
})
export class ProjectPageComponent {
  public viewModel$!: Observable<ViewModel>
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
  protected readonly MAX_SWIPERS_PER_VIEWPORT = 2

  constructor(
    private projectsService: ProjectsService,
    private router: Router,
    private seo: SeoService,
    private projectLookbooksService: ProjectLookbooksService,
    private projectsImagesService: ProjectImagesService,
    private imageResponsiveBreakpointsService: ImageResponsiveBreakpointsService,
    private sanitizer: DomSanitizer,
    private destroyRef: DestroyRef,
  ) {}

  @Input({ required: true })
  public set slug(slug: string) {
    this.viewModel$ = this.projectsService.bySlug(slug).pipe(
      tap({
        next: (project) => {
          this.seo.setUrl(getCanonicalUrlForPath(PROJECTS_PATH, slug))
          this.seo.setTitle(getTitle(project.title))
          this.seo.setDescription(project.description)
        },
        error: () => {
          displayNotFound(this.router).then(noop)
        },
      }),
      concatMap((project) =>
        combineLatest([
          of(
            project.youtubePlaylistId
              ? this.sanitizer.bypassSecurityTrustResourceUrl(
                  new YoutubePlaylist(
                    project.youtubePlaylistId,
                  ).iframeUrl.toString(),
                )
              : undefined,
          ),
          this.projectLookbooksService
            .bySlug(slug, project.lookbookNamesAndSlugs)
            .pipe(catchError(() => of(undefined))),
          this.projectsImagesService
            .bySlugAndFilename(slug, TECH_MATERIAL_IMAGES_FILENAME)
            .pipe(catchError(() => of(undefined))),
          this.projectsImagesService
            .bySlugAndFilename(slug, DESIGN_BOOK_IMAGES_FILENAME)
            .pipe(catchError(() => of(undefined))),
          this.projectsImagesService
            .bySlugAndFilename(slug, CONCEPT_IMAGES_FILENAME)
            .pipe(catchError(() => of(undefined))),
        ]).pipe(map((data) => new ViewModel(...data))),
      ),
      share(),
    )
    this.viewModel$
      .pipe(last(), takeUntilDestroyed(this.destroyRef))
      .subscribe((lastViewModel) => {
        if (!lastViewModel.hasData) {
          displayNotFound(this.router).then(noop)
        }
      })
  }
}

export class ViewModel {
  constructor(
    public readonly youtubeIframeUrl?: SafeResourceUrl,
    public readonly lookbooks?: ReadonlyArray<Lookbook>,
    public readonly techMaterialImages?: ReadonlyArray<ImageAsset>,
    public readonly designBookImages?: ReadonlyArray<ImageAsset>,
    public readonly conceptImages?: ReadonlyArray<ImageAsset>,
  ) {}

  public get hasData(): boolean {
    return !!(
      this.youtubeIframeUrl ||
      this.lookbooks?.length ||
      this.techMaterialImages?.length ||
      this.designBookImages?.length ||
      this.conceptImages?.length
    )
  }
}
