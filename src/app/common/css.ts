import { HORIZONTAL_PAGE_PADDING_PX } from './scss'

export const px = (n: number): string => `${n}px`
export const vw = (n: number): string => `${n}vw`
export const calcSizeWithoutHorizontalPagePadding = (
  size: string,
  pagePaddingDivider = 1,
): string =>
  `calc(${size} - ${px(HORIZONTAL_PAGE_PADDING_PX / pagePaddingDivider)})`
export const sourceSizesFromList = (...sourceSizeList: readonly string[]) =>
  sourceSizeList.join(', ')
export const sourceSize = (sourceValue: string, mediaCondition?: string) =>
  mediaCondition ? `${mediaCondition} ${sourceValue}` : sourceValue
export const maxWidthMediaCondition = (maxWidth: string) =>
  `(max-width: ${maxWidth})`
export const minWidthMediaCondition = (minWidth: string) =>
  `(min-width: ${minWidth})`
calcSizeWithoutHorizontalPagePadding('40')
