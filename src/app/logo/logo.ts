// Keep in sync with SCSS content styles
import { ImageDimensions } from '@/app/common/images/image'

export const LOGO_MAX_HEIGHT_PX = 55
export const getLogoMaxWidthFromDimensions = ({
  width,
  height,
}: ImageDimensions) => Math.ceil((LOGO_MAX_HEIGHT_PX * width) / height)
