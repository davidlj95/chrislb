import { isMain } from './utils/is-main'
import { Log } from './utils/log'
import { MiscImages } from '@/app/common/images/misc-images'
import { GENERATED_DATA_PATH } from './utils/paths'
import { join } from 'path'
import { mkdir } from 'fs/promises'
import { getImageCdnApi } from './images/cdn'
import { ABOUT, logoSizesFromMaxWidth } from './images/sizes'
import { toSignedResponsiveImage } from './images/responsive/to-signed-responsive-image'
import { signResponsiveImage } from './images/responsive/sign-responsive-image'
import { getHighDensityBreakpoints } from './images/responsive/breakpoints-from-sizes-and-dimensions'
import { getLogoMaxWidthFromDimensions } from '@/app/logo/logo'
import { writeJson } from '@/app/common/json/json-file-utils'
import { appendJsonExtension } from '@/app/common/json/json-extension-utils'

export const miscImages = async (): Promise<void> => {
  const imageCdnApi = await getImageCdnApi()
  await mkdir(GENERATED_DATA_PATH, { recursive: true })
  Log.info('Looking for misc images')
  const images = await imageCdnApi.findByPath('misc')
  const [horizontalLogo, aboutPortrait] = ['horizontal', 'portrait'].map(
    (substring) => {
      const image = images.find((image) => image.src.includes(substring))
      if (!image) {
        throw new Error(`Cannot find misc image file containing ${substring}`)
      }
      return image
    },
  )
  const logoMaxWidth = getLogoMaxWidthFromDimensions(horizontalLogo)
  const miscImages: MiscImages = {
    horizontalLogo: await signResponsiveImage(
      {
        ...horizontalLogo,
        breakpoints: getHighDensityBreakpoints(
          logoMaxWidth,
          horizontalLogo.width,
        ),
        sizes: logoSizesFromMaxWidth(logoMaxWidth).toString(),
      },
      imageCdnApi,
    ),
    aboutPortrait: await toSignedResponsiveImage(
      aboutPortrait,
      ABOUT,
      imageCdnApi,
    ),
  }
  await writeJson(
    join(GENERATED_DATA_PATH, appendJsonExtension('misc-images')),
    miscImages,
  )
}

if (isMain(import.meta.url)) {
  await miscImages()
  Log.ok('All done')
}
