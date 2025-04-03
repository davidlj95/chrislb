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
    return albums.map(({ title, images, imageSizes, size }) => {
      return {
        title,
        images,
        imageSizes,
        size,
        swiper: this._albumSwiperByPresetSize[size],
      }
    })
  })

  protected readonly _maxSwipersPerViewport = 2

  private readonly _albumSwiperByPresetSize: Record<
    ProjectDetailAlbum['size'],
    ProjectAlbumSwiper
  > = {
    full: {
      options: {
        slidesPerView: FULL_SCREEN_SWIPER.slidesPerView,
      },
      maxWidthPx: FULL_SCREEN_SWIPER.maxWidth,
    },
    half: {
      options: {
        slidesPerView: HALF_SCREEN_SWIPER.slidesPerView,
      },
    },
  }

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
  readonly maxWidthPx?: number
}

const FULL_SCREEN_SWIPER = {
  slidesPerView: 2,
  maxWidth: 850,
}
const HALF_SCREEN_SWIPER = {
  slidesPerView: 1,
}
