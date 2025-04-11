import { SourceSizeList, sourceSizeList } from './models/source-size-list'
import { SourceSize, sourceSize } from './models/source-size'
import { Px, Vw } from './models/css-length'
import { maxWidth, minWidth } from './models/css-media-condition'
import { BREAKPOINT_S_PX, BREAKPOINT_XS_PX } from '@/app/common/breakpoints'
import {
  PROJECT_LIST_ITEM_SLIDES_PER_VIEW,
  ProjectDetailAlbum,
} from '@/app/projects/project'
import { PROJECT_DETAIL_PAGE_SWIPER_FULL } from '@/app/projects/project-detail-page/project-detail-page-swipers'
import { HORIZONTAL_PAGE_PADDING_PX } from '@/app/common/paddings'

const horizontalPagePadding = (divider = 1) =>
  Px(HORIZONTAL_PAGE_PADDING_PX / divider)
const withHorizontalPagePadding = (
  length: SourceSize['length'],
  divider = 1,
): SourceSize['length'] => {
  const padding = horizontalPagePadding(divider)
  return padding.quantity === 0
    ? length
    : Array.isArray(length)
      ? [...length, padding]
      : [length, padding]
}
const withoutHorizontalPagePadding = (
  length: SourceSize['length'],
  divider = 1,
): SourceSize['length'] => withHorizontalPagePadding(length, divider * -1)

export const ABOUT = sourceSizeList(
  sourceSize(withoutHorizontalPagePadding(Vw(35)), minWidth(BREAKPOINT_S_PX)),
  sourceSize(withoutHorizontalPagePadding(Vw(60)), minWidth(BREAKPOINT_XS_PX)),
  sourceSize(withoutHorizontalPagePadding(Vw(75))),
)

export const logoSizesFromMaxWidth = (maxWidthPx: number) => {
  return sourceSizeList(
    sourceSize(
      withoutHorizontalPagePadding(Vw(100)),
      maxWidth(maxWidthPx + HORIZONTAL_PAGE_PADDING_PX),
    ),
    sourceSize(Px(maxWidthPx)),
  )
}

export const PROJECT_LIST_ITEM = (() => {
  const SLIDES_PER_VIEW = PROJECT_LIST_ITEM_SLIDES_PER_VIEW
  return sourceSizeList(
    sourceSize(
      withoutHorizontalPagePadding(Vw(33.3), SLIDES_PER_VIEW),
      minWidth(BREAKPOINT_S_PX),
    ),
    sourceSize(
      withoutHorizontalPagePadding(Vw(100 / SLIDES_PER_VIEW), SLIDES_PER_VIEW),
    ),
  )
})()

export const PROJECT_DETAIL_BY_PRESET_SIZE: Record<
  ProjectDetailAlbum['size'],
  SourceSizeList
> = {
  full: (() => {
    const FIXED_WIDTH_PX = PROJECT_DETAIL_PAGE_SWIPER_FULL.maxWidthPx
    const SLIDES_PER_VIEW = PROJECT_DETAIL_PAGE_SWIPER_FULL.slidesPerView
    return sourceSizeList(
      sourceSize(
        withoutHorizontalPagePadding(
          Px(FIXED_WIDTH_PX / SLIDES_PER_VIEW),
          SLIDES_PER_VIEW,
        ),
        minWidth(FIXED_WIDTH_PX + HORIZONTAL_PAGE_PADDING_PX),
      ),
      sourceSize(
        withoutHorizontalPagePadding(
          Vw(100 / SLIDES_PER_VIEW),
          SLIDES_PER_VIEW,
        ),
      ),
    )
  })(),
  half: (() => {
    const SLIDERS_WIDE_VIEW = 2
    const SLIDERS_NARROW_VIEW = 1
    return sourceSizeList(
      sourceSize(
        withoutHorizontalPagePadding(
          Vw(100 / SLIDERS_WIDE_VIEW),
          SLIDERS_WIDE_VIEW,
        ),
        minWidth(BREAKPOINT_S_PX),
      ),
      sourceSize(
        withoutHorizontalPagePadding(
          Vw(100 / SLIDERS_NARROW_VIEW),
          SLIDERS_NARROW_VIEW,
        ),
      ),
    )
  })(),
}
