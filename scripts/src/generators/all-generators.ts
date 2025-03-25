import { isMain } from '../utils/is-main'
import { Log } from '../utils/log'
import { ImagesListsGenerators } from './images-lists-generators'
import { ContentGenerators } from './content-generators'
import { generateProjectsContent } from './generate-projects-content'
import { generateRoutesFile } from './generate-routes-file'

export class AllGenerators {
  constructor(
    private readonly _imagesListsGenerators: ImagesListsGenerators,
    private readonly _contentGenerators: ContentGenerators,
  ) {}

  static fromEnv() {
    return new this(ImagesListsGenerators.fromEnv(), new ContentGenerators())
  }

  async generate(): Promise<void> {
    await Promise.all([
      this._imagesListsGenerators.all(),
      this._contentGenerators.all(),
    ])
    await generateProjectsContent()
    await generateRoutesFile()
  }
}

if (isMain(import.meta.url)) {
  await AllGenerators.fromEnv().generate()

  Log.ok('All done')
}
