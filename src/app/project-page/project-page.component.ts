import { Component, Input } from '@angular/core'
import { ProjectLookbooksService } from './project-lookbooks.service'
import { Router } from '@angular/router'
import { map, noop, Observable, tap } from 'rxjs'
import { displayNotFound } from '../common/navigation'
import { SwiperOptions } from 'swiper/types'
import { ImageAsset } from '../../data/images/types'
import { DEFAULT_IMAGE_ALT } from '../common/default-image-alt'

@Component({
  selector: 'app-project-page',
  templateUrl: './project-page.component.html',
  styleUrls: ['./project-page.component.scss'],
})
export class ProjectPageComponent {
  public lookbooks!: Observable<ReadonlyArray<Lookbook>>
  protected readonly MAX_SLIDES_PER_VIEW = 3
  protected readonly MAX_LOOKBOOKS_PER_VIEWPORT = 2
  protected readonly DEFAULT_IMAGE_ALT = DEFAULT_IMAGE_ALT

  constructor(
    private projectsLookbooksService: ProjectLookbooksService,
    private router: Router,
  ) {}

  @Input({ required: true })
  public set slug(slug: string) {
    this.lookbooks = this.projectsLookbooksService.bySlug(slug).pipe(
      map((lookbooksImages) =>
        lookbooksImages.map((lookbookImages) => ({
          images: lookbookImages,
          swiperOptions: this.getSwiperOptions(lookbookImages.length),
        })),
      ),
      tap((lookbooks) => {
        if (lookbooks.length === 0) {
          displayNotFound(this.router).then(noop)
        }
        return lookbooks
      }),
    )
  }

  private getSwiperOptions(slidesCount: number): SwiperOptions {
    const loop = slidesCount > this.MAX_SLIDES_PER_VIEW * 2
    return {
      pagination: {
        enabled: true,
        clickable: true,
        dynamicBullets: true,
      },
      navigation: {
        enabled: true,
      },
      keyboard: {
        enabled: true,
      },
      loop,
      rewind: !loop,
      autoplay: {
        disableOnInteraction: true,
        delay: 2500,
      },
      slidesPerView: 2,
      breakpoints: {
        959.98: {
          slidesPerView: this.MAX_SLIDES_PER_VIEW,
        },
      },
    }
  }
}

interface Lookbook {
  readonly images: ReadonlyArray<ImageAsset>
  readonly swiperOptions: SwiperOptions
}
