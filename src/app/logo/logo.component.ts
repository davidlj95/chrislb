import { Component } from '@angular/core'
import { NgOptimizedImage } from '@angular/common'
import { RouterLink } from '@angular/router'
import { MISC_IMAGES } from '../common/images/misc-images'
import { ToNgSrcSet } from '../common/images/to-ng-src-set'
import { HORIZONTAL_PAGE_PADDING_PX } from '../common/scss'
import {
  calcSizeWithoutHorizontalPagePadding,
  maxWidthMediaCondition,
  px,
  sourceSize,
  sourceSizesFromList,
  vw,
} from '../common/css'

@Component({
  selector: 'app-logo',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.scss'],
  standalone: true,
  imports: [RouterLink, NgOptimizedImage, ToNgSrcSet],
})
export class LogoComponent {
  protected readonly _horizontalLogo = MISC_IMAGES.horizontalLogo
  protected readonly _sizes = MAX_WIDTH_PX
    ? sourceSizesFromList(
        sourceSize(
          px(MAX_WIDTH_PX),
          maxWidthMediaCondition(px(MAX_WIDTH_PX + HORIZONTAL_PAGE_PADDING_PX)),
        ),
        sourceSize(calcSizeWithoutHorizontalPagePadding(vw(100))),
      )
    : undefined
}

// 👇 Keep in sync with SCSS for responsive sizing
const LOGO_MAX_HEIGHT_PX = 55
const MAX_WIDTH_PX = MISC_IMAGES.horizontalLogo
  ? (MISC_IMAGES.horizontalLogo?.width / MISC_IMAGES.horizontalLogo?.height) *
      LOGO_MAX_HEIGHT_PX -
    HORIZONTAL_PAGE_PADDING_PX
  : undefined
