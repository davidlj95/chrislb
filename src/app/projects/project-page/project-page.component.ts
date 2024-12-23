import { Component, OnInit } from '@angular/core'
import { catchError, concatMap, map, Observable, of, tap } from 'rxjs'
import { NavigatorService } from '../../common/routing/navigator.service'
import { AnyAssetsCollection } from './any-asset-collection'
import { ProjectAssetsCollectionsService } from './project-assets-collections.service'
import { SwiperOptions } from 'swiper/types'
import { AssetsCollectionData } from './assets-collection-data'
import { AssetsCollectionSize } from './assets-collection-size'
import { AssetsCollectionType } from './assets-collection-type'
import { ResponsiveImageAttributesService } from '../../common/images/responsive-image-attributes.service'
import { ResponsiveImageAttributes } from '../../common/images/responsive-image-attributes'
import { CssPxUnit, Px } from '../../common/css/unit/px'
import { Vw } from '../../common/css/unit/vw'
import { CssMinMaxMediaQuery } from '../../common/css/css-min-max-media-query'
import { Breakpoint } from '../../common/style/breakpoint'
import { isEmpty } from 'lodash-es'
import { ActivatedRoute } from '@angular/router'
import { ProjectRouteData } from './projects-routes-data'
import { GlobalMetadata, NgxMetaService } from '@davidlj95/ngx-meta/core'
import { PROJECTS_PATH } from '../../common/routing/paths'
import { getCanonicalUrlForPath } from '../../common/routing/get-canonical-url-for-path'
import { getTitle } from '../../common/routing/get-title'
import { SanitizeResourceUrlPipe } from '../sanitize-resource-url.pipe'
import { ImagesSwiperComponent } from '../images-swiper/images-swiper.component'
import { AsyncPipe, NgFor, NgIf } from '@angular/common'

@Component({
  selector: 'app-project-page',
  templateUrl: './project-page.component.html',
  styleUrls: ['./project-page.component.scss'],
  imports: [
    NgIf,
    NgFor,
    ImagesSwiperComponent,
    AsyncPipe,
    SanitizeResourceUrlPipe,
  ],
  providers: [ProjectAssetsCollectionsService],
})
export class ProjectPageComponent implements OnInit {
  public assetsCollections$!: Observable<readonly AnyAssetsCollectionItem[]>
  public readonly fullScreenSwiper = {
    slidesPerView: 2,
    maxWidth: Px(850),
    get maxSlideWidth() {
      return Px(this.maxWidth.value / this.slidesPerView)
    },
  }
  public readonly halfScreenSwiper = {
    slidesPerView: 1,
  }
  protected readonly MAX_SWIPERS_PER_VIEWPORT = 2
  protected readonly imageAssetsSwiperConfigByName: {
    [k in AssetsCollectionData['size']]: ImageAssetsSwiperConfig
  }
  protected readonly AssetsCollectionSize = AssetsCollectionSize
  protected readonly AssetsCollectionType = AssetsCollectionType

  constructor(
    private activatedRoute: ActivatedRoute,
    private ngxMetaService: NgxMetaService,
    private navigatorService: NavigatorService,
    private projectAssetsCollectionsService: ProjectAssetsCollectionsService,
    responsiveImageAttributesService: ResponsiveImageAttributesService,
  ) {
    this.imageAssetsSwiperConfigByName = {
      [AssetsCollectionSize.Full]: {
        customSwiperOptions: {
          slidesPerView: this.fullScreenSwiper.slidesPerView,
        },
        attributes: responsiveImageAttributesService
          .fixedSinceWidth(this.fullScreenSwiper.maxSlideWidth, {
            minWidth: this.fullScreenSwiper.maxWidth,
          })
          .concat(
            responsiveImageAttributesService.vw(
              Vw(100 / this.fullScreenSwiper.slidesPerView),
              CssMinMaxMediaQuery.max(this.fullScreenSwiper.maxWidth),
              // ℹ️ Here the media query is included in previous attribute set
            ),
          )
          .reduce(),
        maxWidth: this.fullScreenSwiper.maxWidth,
      },
      [AssetsCollectionSize.Half]: {
        customSwiperOptions: {
          slidesPerView: this.halfScreenSwiper.slidesPerView,
        },
        attributes: responsiveImageAttributesService
          .vw(
            Vw(50 / this.halfScreenSwiper.slidesPerView),
            CssMinMaxMediaQuery.min(Breakpoint.S.px),
          )
          .concat(
            responsiveImageAttributesService.vw(
              Vw(100 / this.halfScreenSwiper.slidesPerView),
              CssMinMaxMediaQuery.max(Breakpoint.S.almost),
              { includeMediaQueryInSizes: true },
            ),
          )
          .reduce(),
      },
    }
  }

  ngOnInit(): void {
    const project$ = this.activatedRoute.data.pipe(
      map((data) => (data as ProjectRouteData).project),
      tap({
        next: (project) => {
          this.ngxMetaService.set({
            canonicalUrl: getCanonicalUrlForPath(PROJECTS_PATH, project.slug),
            title: getTitle(project.title),
            description:
              project.description.length > 200
                ? project.description.substring(0, 197) + '...'
                : project.description,
          } satisfies GlobalMetadata)
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
      map((assetsCollections) =>
        assetsCollections.map((assetCollection) => ({
          ...assetCollection,
          imagesSwiperConfig:
            this.imageAssetsSwiperConfigByName[assetCollection.data.size],
        })),
      ),
      tap((assetsCollections) => {
        if (isEmpty(assetsCollections)) {
          this.navigatorService.displayNotFoundPage()
        }
      }),
    )
  }
}

type AnyAssetsCollectionItem = AnyAssetsCollection & {
  readonly imagesSwiperConfig: ImageAssetsSwiperConfig
}

interface ImageAssetsSwiperConfig {
  readonly customSwiperOptions: SwiperOptions
  readonly attributes: ResponsiveImageAttributes
  readonly maxWidth?: CssPxUnit
}
