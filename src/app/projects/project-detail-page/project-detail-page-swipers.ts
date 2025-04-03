import { ProjectDetailAlbum } from '../project'

export interface ProjectDetailPageSwiper {
  slidesPerView: number
  maxWidthPx?: number
}

export const PROJECT_DETAIL_PAGE_SWIPER_FULL = {
  slidesPerView: 2,
  maxWidthPx: 850,
} satisfies ProjectDetailPageSwiper

export const PROJECT_DETAIL_PAGE_SWIPER_HALF = {
  slidesPerView: 1,
} satisfies ProjectDetailPageSwiper

export const PROJECT_DETAIL_PAGE_SWIPER_BY_SIZE: Record<
  ProjectDetailAlbum['size'],
  ProjectDetailPageSwiper
> = {
  full: PROJECT_DETAIL_PAGE_SWIPER_FULL,
  half: PROJECT_DETAIL_PAGE_SWIPER_HALF,
}
