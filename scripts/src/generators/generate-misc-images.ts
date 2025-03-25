import { isMain } from '../utils/is-main'
import { Imagekit } from '../images/imagekit'
import { Log } from '../utils/log'
import { IMAGES_FILE_BASENAME } from '../../../src/app/common/files'
import { MiscImages } from '../../../src/app/common/images/misc-images'
import { appendJsonExtension, writeJson } from '../utils/json'
import { MISC_PATH } from '../utils/paths'
import { basename, join } from 'path'

export const generateMiscImages = async (): Promise<void> => {
  const imageCdnApi = Imagekit.fromEnv()
  Log.info('Looking for misc images')
  const images = await imageCdnApi.getAllImagesInPath(basename(MISC_PATH))
  const [horizontalLogo, aboutPortrait] = ['horizontal', 'portrait'].map(
    (substring) => {
      const image = images.find((image) => image.name.includes(substring))
      if (!image) {
        throw new Error(`Cannot find misc image file containing ${substring}`)
      }
      return image
    },
  )
  const miscImages: MiscImages = {
    horizontalLogo,
    aboutPortrait,
  }
  await writeJson(
    join(MISC_PATH, appendJsonExtension(IMAGES_FILE_BASENAME)),
    miscImages,
  )
}

if (isMain(import.meta.url)) {
  await generateMiscImages()
  Log.ok('All done')
}
