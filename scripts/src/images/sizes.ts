import { SourceSizeList, sourceSizeList } from '../models/source-size-list'
import { sourceSize } from '../models/source-size'
import { Px, Vw } from '../models/css-length'
import { maxWidth, minWidth } from '../models/css-media-condition'
import { BREAKPOINT_S_PX, BREAKPOINT_XS_PX } from '@/app/common/breakpoints'
import { ProjectDetailAlbum } from '@/app/projects/project'
import { PROJECT_DETAIL_PAGE_SWIPER_FULL } from '@/app/projects/project-detail-page/project-detail-page-swipers'

// TODO: add horizontal padding
export const ABOUT = sourceSizeList(
  sourceSize(Vw(35), minWidth(BREAKPOINT_S_PX)),
  sourceSize(Vw(60), minWidth(BREAKPOINT_XS_PX)),
  sourceSize(Vw(75)),
)

// TODO: could be just one asset indeed (for max-height + multiple densities)
export const LOGO = (() => {
  const LOGO_ASPECT_RATIO = { width: 2757, height: 409 }
  // Keep in sync with SCSS
  const MAX_HEIGHT_PX = 55
  const MAX_WIDTH_PX = Math.ceil(
    (MAX_HEIGHT_PX * LOGO_ASPECT_RATIO.width) / LOGO_ASPECT_RATIO.height,
  )
  return sourceSizeList(
    sourceSize(Vw(100), maxWidth(MAX_WIDTH_PX)),
    sourceSize(Px(MAX_WIDTH_PX)),
  )
})()

export const PROJECT_LIST_ITEM = sourceSizeList(
  sourceSize(Vw(33.3), minWidth(BREAKPOINT_S_PX)),
  sourceSize(Vw(50)),
)

export const PROJECT_DETAIL_BY_PRESET_SIZE: Record<
  ProjectDetailAlbum['size'],
  SourceSizeList
> = {
  full: (() => {
    const FIXED_WIDTH_PX = PROJECT_DETAIL_PAGE_SWIPER_FULL.maxWidthPx
    const SLIDES_PER_VIEW = PROJECT_DETAIL_PAGE_SWIPER_FULL.slidesPerView
    return sourceSizeList(
      sourceSize(
        Px(FIXED_WIDTH_PX / SLIDES_PER_VIEW),
        minWidth(FIXED_WIDTH_PX),
      ),
      sourceSize(Vw(100 / SLIDES_PER_VIEW)),
    )
  })(),
  half: (() => {
    const SLIDERS_WIDE_VIEW = 2
    const SLIDERS_NARROW_VIEW = 1
    return sourceSizeList(
      sourceSize(Vw(100 / SLIDERS_WIDE_VIEW), minWidth(BREAKPOINT_S_PX)),
      sourceSize(Vw(100 / SLIDERS_NARROW_VIEW)),
    )
  })(),
}
