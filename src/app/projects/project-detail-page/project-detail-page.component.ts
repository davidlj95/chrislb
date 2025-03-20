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
import { ProjectRouteData } from './projects-routes-data'
import { GlobalMetadata, NgxMetaService } from '@davidlj95/ngx-meta/core'
import { getTitle } from '../../common/routing/get-title'
import { SanitizeResourceUrlPipe } from '../sanitize-resource-url.pipe'
import { ImagesSwiperComponent } from '../images-swiper/images-swiper.component'
import { toSignal } from '@angular/core/rxjs-interop'
import { AnyAssetsCollection } from './any-asset-collection'

@Component({
  selector: 'app-project-detail-page',
  templateUrl: './project-detail-page.component.html',
  styleUrls: ['./project-detail-page.component.scss'],
  standalone: true,
  imports: [ImagesSwiperComponent, SanitizeResourceUrlPipe],
  providers: [ProjectAssetsCollectionsService],
})
export class ProjectDetailPageComponent {
  readonly project = toSignal(
    this._activatedRoute.data.pipe(
      map((data) => (data as ProjectRouteData).project),
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
      const project = this.project()
      if (!project) {
        return
      }
      ngxMetaService.set({
        title: getTitle(project.title),
        description:
          project.description.length > 200
            ? project.description.substring(0, 197) + '...'
            : project.description,
      } satisfies GlobalMetadata)
      projectAssetsCollectionsService
        .byProject(project)
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
