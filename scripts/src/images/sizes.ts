import { sourceSizeList } from '../models/source-size-list'
import { sourceSize } from '../models/source-size'
import { Px, Vw } from '../models/css-length'
import { maxWidth, minWidth } from '../models/css-media-condition'
import { BREAKPOINT_S_PX, BREAKPOINT_XS_PX } from '@/app/common/breakpoints'

// TODO: add horizontal padding
export const ABOUT = sourceSizeList(
  sourceSize(Vw(35), minWidth(BREAKPOINT_S_PX)),
  sourceSize(Vw(60), minWidth(BREAKPOINT_XS_PX)),
  sourceSize(Vw(75)),
)

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

export const PROJECT_DETAIL_FULL = (() => {
  const FIXED_WIDTH_PX = 850
  const SLIDES_PER_VIEW = 2
  return sourceSizeList(
    sourceSize(Px(FIXED_WIDTH_PX / SLIDES_PER_VIEW), minWidth(FIXED_WIDTH_PX)),
    sourceSize(Vw(100 / SLIDES_PER_VIEW)),
  )
})()

export const PROJECT_DETAIL_HALF = (() => {
  const SLIDERS_WIDE_VIEW = 2
  const SLIDERS_NARROW_VIEW = 1
  return sourceSizeList(
    sourceSize(Vw(100 / SLIDERS_WIDE_VIEW), minWidth(BREAKPOINT_S_PX)),
    sourceSize(Vw(100 / SLIDERS_NARROW_VIEW)),
  )
})()
