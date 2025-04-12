import {
  Component,
  computed,
  CUSTOM_ELEMENTS_SCHEMA,
  input,
} from '@angular/core'
import { register as registerSwiper } from 'swiper/element'
import { SwiperOptions } from 'swiper/types'
import {
  A11y,
  Autoplay,
  Keyboard,
  Navigation,
  Pagination,
} from 'swiper/modules'
import { ResponsiveImage } from '../../common/images/image'
import { SwiperDirective } from './swiper.directive'
import { NgOptimizedImage } from '@angular/common'
import { ToNgSrcSet } from '@/app/common/images/to-ng-src-set'
import { ToLoaderParams } from '@/app/common/images/loader-params'

// There's no fancier way to install Web Components in Angular :P
// https://stackoverflow.com/a/75353889/3263250
registerSwiper()

@Component({
  selector: 'app-images-swiper',
  templateUrl: './images-swiper.component.html',
  styleUrls: ['./images-swiper.component.scss'],
  standalone: true,
  imports: [SwiperDirective, NgOptimizedImage, ToNgSrcSet, ToLoaderParams],
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
  protected readonly _swiperOptions = computed<SwiperOptions>(() => ({
    ...DEFAULT_SWIPER_OPTIONS,
    slidesPerView: this.slidesPerView(),
  }))
}

const DEFAULT_SWIPER_OPTIONS = {
  modules: [A11y, Autoplay, Keyboard, Navigation, Pagination],
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
} satisfies SwiperOptions
