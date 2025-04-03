import { isMain } from './utils/is-main'
import { Log } from './utils/log'
import { MiscImages } from '@/app/common/images/misc-images'
import { appendJsonExtension, writeJson } from './utils/json'
import { GENERATED_DATA_PATH } from './utils/paths'
import { join } from 'path'
import { mkdir } from 'fs/promises'
import { getImageCdnApi } from './images/cdn'
import { ABOUT, LOGO } from './images/sizes'

export const miscImages = async (): Promise<void> => {
  const imageCdnApi = getImageCdnApi()
  await mkdir(GENERATED_DATA_PATH, { recursive: true })
  Log.info('Looking for misc images')
  const images = await imageCdnApi.getAllImagesInPath('misc')
  const [horizontalLogo, aboutPortrait] = ['horizontal', 'portrait'].map(
    (substring) => {
      const image = images.find((image) => image.src.includes(substring))
      if (!image) {
        throw new Error(`Cannot find misc image file containing ${substring}`)
      }
      return image
    },
  )
  const miscImages: MiscImages = {
    horizontalLogo: await imageCdnApi.responsiveImage(horizontalLogo, LOGO),
    aboutPortrait: await imageCdnApi.responsiveImage(aboutPortrait, ABOUT),
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
