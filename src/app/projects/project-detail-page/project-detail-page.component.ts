import { Component, computed, effect } from '@angular/core'
import { map } from 'rxjs'
import { SwiperOptions } from 'swiper/types'
import { ActivatedRoute } from '@angular/router'
import { ProjectDetailRouteData } from './projects-routes-data'
import { GlobalMetadata, NgxMetaService } from '@davidlj95/ngx-meta/core'
import { getTitle } from '../../common/routing/get-title'
import { SanitizeResourceUrlPipe } from '../sanitize-resource-url.pipe'
import { ImagesSwiperComponent } from '../images-swiper/images-swiper.component'
import { toSignal } from '@angular/core/rxjs-interop'
import { ProjectDetail, ProjectDetailAlbum } from '../project'
import { HORIZONTAL_PAGE_PADDING_PX } from '../../common/scss'
import {
  calcSizeWithoutHorizontalPagePadding,
  minWidthMediaCondition,
  px,
  sourceSize,
  sourceSizesFromList,
  vw,
} from '../../common/css'
import { BREAKPOINT_S_PX } from '../../common/style/breakpoints'

@Component({
  templateUrl: './project-detail-page.component.html',
  styleUrls: ['./project-detail-page.component.scss'],
  standalone: true,
  imports: [ImagesSwiperComponent, SanitizeResourceUrlPipe],
})
export class ProjectDetailPageComponent {
  private readonly _projectDetail = toSignal(
    this._activatedRoute.data.pipe(
      map((data) => (data as ProjectDetailRouteData).projectDetail),
    ),
  )

  protected readonly _youtubePlaylistUrl = computed<URL | undefined>(() => {
    const playlistId = this._projectDetail()?.youtubePlaylistId
    if (!playlistId) {
      return
    }
    const iframeUrl = new URL('https://www.youtube-nocookie.com/embed')
    iframeUrl.searchParams.set('listType', 'playlist')
    iframeUrl.searchParams.set('loop', true.toString())
    iframeUrl.searchParams.set('list', playlistId)
    return iframeUrl
  })

  readonly _albums = computed<readonly ProjectAlbumViewModel[]>(() => {
    const albums = this._projectDetail()?.albums
    if (!albums) {
      return []
    }
    return albums.map(({ title, images, size }) => {
      return {
        title,
        images,
        size,
        swiper: ALBUM_SWIPER_BY_SIZE[size],
      }
    })
  })

  protected readonly _maxSwipersPerViewport = 2

  constructor(
    private readonly _activatedRoute: ActivatedRoute,
    ngxMetaService: NgxMetaService,
  ) {
    effect(() => {
      const projectDetail = this._projectDetail()
      if (!projectDetail) {
        return
      }
      ngxMetaService.set({
        title: getTitle(projectDetail.title),
        description: getDescription(projectDetail) ?? undefined,
      } satisfies GlobalMetadata)
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

type ProjectAlbumViewModel = ProjectDetailAlbum & {
  readonly swiper: ProjectAlbumSwiper
}

interface ProjectAlbumSwiper {
  readonly options: SwiperOptions
  readonly sizes: string
  readonly maxWidthPx?: number
}

const ALBUM_SWIPER_BY_SIZE: Record<
  ProjectDetailAlbum['size'],
  ProjectAlbumSwiper
> = {
  full: (() => {
    const SLIDES_PER_VIEW = 2
    const MAX_WIDTH_PX = 850
    const MAX_SLIDE_WIDTH_PX = MAX_WIDTH_PX / SLIDES_PER_VIEW
    return {
      options: { slidesPerView: 2 },
      sizes: sourceSizesFromList(
        sourceSize(
          calcSizeWithoutHorizontalPagePadding(
            px(MAX_SLIDE_WIDTH_PX),
            SLIDES_PER_VIEW,
          ),
          minWidthMediaCondition(px(MAX_WIDTH_PX + HORIZONTAL_PAGE_PADDING_PX)),
        ),
        sourceSize(
          calcSizeWithoutHorizontalPagePadding(
            vw(100 / SLIDES_PER_VIEW),
            SLIDES_PER_VIEW,
          ),
        ),
      ),
      maxWidthPx: MAX_WIDTH_PX,
    }
  })(),
  half: (() => {
    const SLIDES_PER_VIEW = 1
    return {
      options: { slidesPerView: SLIDES_PER_VIEW },
      sizes: sourceSizesFromList(
        sourceSize(
          calcSizeWithoutHorizontalPagePadding(
            vw(50 / SLIDES_PER_VIEW),
            SLIDES_PER_VIEW * 2,
          ),
          minWidthMediaCondition(px(BREAKPOINT_S_PX)),
        ),
        sourceSize(
          calcSizeWithoutHorizontalPagePadding(
            vw(100 / SLIDES_PER_VIEW),
            SLIDES_PER_VIEW,
          ),
        ),
      ),
    }
  })(),
}
