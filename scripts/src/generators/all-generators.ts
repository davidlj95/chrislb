import { isMain } from '../utils/is-main'
import { Log } from '../utils/log'
import { ImagesListsGenerators } from './images-lists-generators'
import { ContentGenerators } from './content-generators'
import { RoutesFileGenerator } from './routes-file-generator'

export class AllGenerators {
  constructor(
    private readonly _imagesListsGenerators: ImagesListsGenerators,
    private readonly _contentGenerators: ContentGenerators,
    private readonly _routesFileGenerator: RoutesFileGenerator,
  ) {}

  static fromEnv() {
    return new this(
      ImagesListsGenerators.fromEnv(),
      new ContentGenerators(),
      new RoutesFileGenerator(),
    )
  }

  async generate(): Promise<void> {
    await this._imagesListsGenerators.all()
    await this._contentGenerators.all()
    await this._routesFileGenerator.all()
  }
}

if (isMain(import.meta.url)) {
  await AllGenerators.fromEnv().generate()

  Log.ok('All done')
}
