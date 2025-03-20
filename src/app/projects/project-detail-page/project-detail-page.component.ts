import { Component, effect, signal } from '@angular/core'
import { catchError, map, of } from 'rxjs'
import { NavigatorService } from '../../common/routing/navigator.service'
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
import { ActivatedRoute } from '@angular/router'
import { ProjectDetailRouteData } from './projects-routes-data'
import { GlobalMetadata, NgxMetaService } from '@davidlj95/ngx-meta/core'
import { getTitle } from '../../common/routing/get-title'
import { SanitizeResourceUrlPipe } from '../sanitize-resource-url.pipe'
import { ImagesSwiperComponent } from '../images-swiper/images-swiper.component'
import { toSignal } from '@angular/core/rxjs-interop'
import { AnyAssetsCollection } from './any-asset-collection'
import { ProjectDetail } from '../project'

@Component({
  templateUrl: './project-detail-page.component.html',
  styleUrls: ['./project-detail-page.component.scss'],
  standalone: true,
  imports: [ImagesSwiperComponent, SanitizeResourceUrlPipe],
  providers: [ProjectAssetsCollectionsService],
})
export class ProjectDetailPageComponent {
  readonly projectDetail = toSignal(
    this._activatedRoute.data.pipe(
      map((data) => (data as ProjectDetailRouteData).projectDetail),
    ),
  )
  readonly assetsCollections = signal<
    readonly AssetsCollectionWithSwiperConfig[]
  >([])

  protected readonly _maxSwipersPerViewport = 2
  private readonly _imageAssetsSwiperConfigByName: Record<
    AssetsCollectionData['size'],
    ImageAssetsSwiperConfig
  > = {
    [AssetsCollectionSize.Full]: {
      customSwiperOptions: {
        slidesPerView: FULL_SCREEN_SWIPER.slidesPerView,
      },
      attributes: this._responsiveImageAttributesService
        .fixedSinceWidth(FULL_SCREEN_SWIPER.maxSlideWidth, {
          minWidth: FULL_SCREEN_SWIPER.maxWidth,
        })
        .concat(
          this._responsiveImageAttributesService.vw(
            Vw(100 / FULL_SCREEN_SWIPER.slidesPerView),
            CssMinMaxMediaQuery.max(FULL_SCREEN_SWIPER.maxWidth),
            // ℹ️ Here the media query is included in previous attribute set
          ),
        )
        .reduce(),
      maxWidth: FULL_SCREEN_SWIPER.maxWidth,
    },
    [AssetsCollectionSize.Half]: {
      customSwiperOptions: {
        slidesPerView: HALF_SCREEN_SWIPER.slidesPerView,
      },
      attributes: this._responsiveImageAttributesService
        .vw(
          Vw(50 / HALF_SCREEN_SWIPER.slidesPerView),
          CssMinMaxMediaQuery.min(Breakpoint.S.px),
        )
        .concat(
          this._responsiveImageAttributesService.vw(
            Vw(100 / HALF_SCREEN_SWIPER.slidesPerView),
            CssMinMaxMediaQuery.max(Breakpoint.S.almost),
            { includeMediaQueryInSizes: true },
          ),
        )
        .reduce(),
    },
  }
  protected readonly AssetsCollectionSize = AssetsCollectionSize
  protected readonly AssetsCollectionType = AssetsCollectionType

  constructor(
    private readonly _activatedRoute: ActivatedRoute,
    private readonly _responsiveImageAttributesService: ResponsiveImageAttributesService,
    ngxMetaService: NgxMetaService,
    navigatorService: NavigatorService,
    projectAssetsCollectionsService: ProjectAssetsCollectionsService,
  ) {
    effect(() => {
      const projectDetail = this.projectDetail()
      if (!projectDetail) {
        return
      }
      ngxMetaService.set({
        title: getTitle(projectDetail.title),
        description: getDescription(projectDetail) ?? undefined,
      } satisfies GlobalMetadata)
      projectAssetsCollectionsService
        .byProject(projectDetail)
        .pipe(catchError(() => of([])))
        .subscribe((assetsCollections) => {
          if (!assetsCollections.length) {
            navigatorService.displayNotFoundPage()
            return
          }
          const assetsCollectionsWithSwiperConfig =
            assetsCollections.map<AssetsCollectionWithSwiperConfig>(
              (assetCollection) => ({
                ...assetCollection,
                swiperConfig:
                  this._imageAssetsSwiperConfigByName[
                    assetCollection.data.size
                  ],
              }),
            )
          this.assetsCollections.set(assetsCollectionsWithSwiperConfig)
        })
    })
  }
}

const getDescription = ({
  quote,
  description,
}: ProjectDetail): string | void => {
  if (quote) {
    return quote
  }
  if (description) {
    return description.length > 200
      ? description.substring(0, 197) + '...'
      : description
  }
}

interface ImageAssetsSwiperConfig {
  readonly customSwiperOptions: SwiperOptions
  readonly attributes: ResponsiveImageAttributes
  readonly maxWidth?: CssPxUnit
}

type AssetsCollectionWithSwiperConfig = AnyAssetsCollection & {
  swiperConfig: ImageAssetsSwiperConfig
}

const FULL_SCREEN_SWIPER = {
  slidesPerView: 2,
  maxWidth: Px(850),
  get maxSlideWidth() {
    return Px(this.maxWidth.value / this.slidesPerView)
  },
}
const HALF_SCREEN_SWIPER = {
  slidesPerView: 1,
}
