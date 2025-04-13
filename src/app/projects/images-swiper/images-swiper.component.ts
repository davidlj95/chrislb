import {
  Component,
  computed,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  input,
} from '@angular/core'
import { SwiperOptions } from 'swiper/types'
import {
  A11y,
  Autoplay,
  Keyboard,
  Navigation,
  Pagination,
  Virtual,
} from 'swiper/modules'
import { ResponsiveImage } from '../../common/images/image'
import { SwiperDirective } from './swiper.directive'
import { IMAGE_LOADER, ImageLoader, ImageLoaderConfig } from '@angular/common'
import { unsignedBreakpoints } from '@/app/common/images/to-ng-src-set'
import { toLoaderParams } from '@/app/common/images/loader-params'
import { SwiperAutoplayScrollDirective } from '@/app/projects/images-swiper/swiper-autoplay-scroll.directive'

@Component({
  selector: 'app-images-swiper',
  templateUrl: './images-swiper.component.html',
  styleUrls: ['./images-swiper.component.scss'],
  standalone: true,
  imports: [SwiperDirective, SwiperAutoplayScrollDirective],
  // Use swiper web components
  // A better approach would be to declare those but there's no easy way
  // https://stackoverflow.com/a/43012920/3263250
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ImagesSwiperComponent {
  readonly images = input.required<readonly ResponsiveImage[]>()
  readonly sizes = input.required<string>()
  readonly slidesPerView = input.required<number>()
  readonly priority = input(false)
  readonly fixContainerAspectRatio = input(false)
  protected readonly _swiperOptions = computed<SwiperOptions>(() => ({
    ...DEFAULT_SWIPER_OPTIONS,
    slidesPerView: this.slidesPerView(),
  }))

  readonly _imageViewModels = computed<readonly ImageViewModel[]>(() =>
    this.images().map((image, index) => {
      const imageConfig: ImageLoaderConfig = {
        src: image.src,
        loaderParams: toLoaderParams(image),
      }
      const breakpoints = unsignedBreakpoints(image.breakpoints)
      const isPriority = this.priority() && index < this.slidesPerView()
      return {
        src: this._imageLoader(imageConfig),
        width: image.width,
        height: image.height,
        alt: image.alt ?? 'Image',
        srcset: breakpoints
          .map((breakpoint) =>
            [
              this._imageLoader({ ...imageConfig, width: breakpoint }),
              `${breakpoint}w`,
            ].join(' '),
          )
          .join(','),
        sizes: this.sizes(),
        loading: isPriority ? 'eager' : 'lazy',
        fetchPriority: isPriority ? 'high' : 'auto',
      }
    }),
  )
  readonly _imageLoader: ImageLoader = inject(IMAGE_LOADER)
}

const DEFAULT_SWIPER_OPTIONS = {
  modules: [A11y, Autoplay, Keyboard, Navigation, Pagination, Virtual],
  injectStylesUrls: ['/swiper.css'],
  a11y: {
    enabled: false,
  },
  autoplay: {
    disableOnInteraction: true,
    delay: 2500,
  },
  keyboard: {
    enabled: true,
  },
  navigation: {
    enabled: true,
  },
  pagination: {
    enabled: true,
    clickable: true,
    dynamicBullets: true,
  },
  virtual: {
    enabled: true,
  },
} satisfies SwiperOptions

type ImageViewModel = Pick<
  HTMLImageElement,
  | 'src'
  | 'width'
  | 'height'
  | 'alt'
  | 'srcset'
  | 'sizes'
  | 'loading'
  | 'fetchPriority'
>
