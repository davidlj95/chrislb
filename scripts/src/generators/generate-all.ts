import { isMain } from '../utils/is-main'
import { Log } from '../utils/log'
import { generateMiscImages } from './generate-misc-images'
import { generateProjectsContent } from './generate-projects-content'
import { generateRoutesFile } from './generate-routes-file'

export const generateAll = async (): Promise<void> => {
  await generateMiscImages()
  await generateProjectsContent()
  await generateRoutesFile()
}

if (isMain(import.meta.url)) {
  await generateAll()
  Log.ok('All done')
}
