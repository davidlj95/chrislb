import { Component, computed, effect, Inject, PLATFORM_ID } from '@angular/core'
import { map } from 'rxjs'
import { ActivatedRoute } from '@angular/router'
import { ProjectDetailRouteData } from './projects-routes-data'
import { GlobalMetadata, NgxMetaService } from '@davidlj95/ngx-meta/core'
import { SanitizeResourceUrlPipe } from '../sanitize-resource-url.pipe'
import { ImagesSwiperComponent } from '../images-swiper/images-swiper.component'
import { toSignal } from '@angular/core/rxjs-interop'
import { ProjectDetail, ProjectDetailAlbum } from '../project'
import {
  PROJECT_DETAIL_PAGE_SWIPER_BY_SIZE,
  ProjectDetailPageSwiper,
} from '@/app/projects/project-detail-page/project-detail-page-swipers'
import { isPlatformBrowser } from '@angular/common'

@Component({
  templateUrl: './project-detail-page.component.html',
  styleUrls: ['./project-detail-page.component.scss'],
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
    return albums.map((album) => {
      const swiper = PROJECT_DETAIL_PAGE_SWIPER_BY_SIZE[album.size]
      const imagesLimit = isPlatformBrowser(this._platformObject)
        ? Infinity
        : swiper.slidesPerView
      return {
        ...album,
        images: album.images.slice(0, imagesLimit),
        ...PROJECT_DETAIL_PAGE_SWIPER_BY_SIZE[album.size],
      }
    })
  })
  protected readonly _maxSwipersPerViewport = 2

  constructor(
    private readonly _activatedRoute: ActivatedRoute,
    @Inject(PLATFORM_ID) private readonly _platformObject: object,
    ngxMetaService: NgxMetaService,
  ) {
    effect(() => {
      const projectDetail = this._projectDetail()
      if (!projectDetail) {
        return
      }
      ngxMetaService.set({
        title: projectDetail.title,
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

type ProjectAlbumViewModel = ProjectDetailAlbum & ProjectDetailPageSwiper
