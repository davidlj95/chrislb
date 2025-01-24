import {
  afterNextRender,
  Component,
  effect,
  ElementRef,
  Injector,
  input,
} from '@angular/core'
import { ImageAsset } from '../../common/images/image-asset'
import Glide from '@glidejs/glide'
import { NgOptimizedImage } from '@angular/common'
import { ResponsiveImageAttributes } from '../../common/images/responsive-image-attributes'

@Component({
  selector: 'app-images-swiper-glidejs',
  standalone: true,
  imports: [NgOptimizedImage],
  templateUrl: './images-swiper-glidejs.component.html',
  styleUrl: './images-swiper-glidejs.component.scss',
})
export class ImagesSwiperGlidejsComponent {
  readonly images = input.required<readonly ImageAsset[]>()
  readonly responsiveImageAttributes =
    input.required<ResponsiveImageAttributes>()
  readonly priority = input(false)
  readonly maxSlidesPerView = 2

  constructor(elRef: ElementRef<HTMLElement>, injector: Injector) {
    // TODO: Replace by afterRenderEffect. This is now a mix of
    //        - https://stackoverflow.com/a/78272904
    //        - https://stackoverflow.com/a/78327383
    afterNextRender({
      mixedReadWrite: () => {
        const effectRef = effect(
          () => {
            if (this.images().length) {
              new Glide(elRef.nativeElement, {
                type: 'carousel',
                perView: this.maxSlidesPerView,
                gap: 0,
                peek: 0,
                autoplay: 2500,
              }).mount()
            }
            effectRef.destroy()
          },
          { injector, manualCleanup: true },
        )
      },
    })
  }
}
