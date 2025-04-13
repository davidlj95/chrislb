// Keep in sync with SCSS content styles
import { ImageDimensions } from '@/app/common/images/image'

export const LOGO_MAX_HEIGHT_PX = 55
const VERTICAL_PADDING_PX = 32
export const LOGO_HEIGHT_PX = LOGO_MAX_HEIGHT_PX + VERTICAL_PADDING_PX
export const getLogoMaxWidthFromDimensions = ({
  width,
  height,
}: ImageDimensions) => Math.ceil((LOGO_MAX_HEIGHT_PX * width) / height)
