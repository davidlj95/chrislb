import { isMain } from '../utils/is-main'
import { Log } from '../utils/log'
import { ImagesListsGenerators } from './images-lists-generators'
import { ContentGenerators } from './content-generators'
import { RoutesFileGenerator } from './routes-file-generator'

export class AllGenerators {
  constructor(
    private readonly imagesListsGenerators: ImagesListsGenerators,
    private readonly contentGenerators: ContentGenerators,
    private readonly routesFileGenerator: RoutesFileGenerator,
  ) {}

  public static fromEnv() {
    return new this(
      ImagesListsGenerators.fromEnv(),
      new ContentGenerators(),
      new RoutesFileGenerator(),
    )
  }

  public async generate(): Promise<void> {
    await this.imagesListsGenerators.all()
    await this.contentGenerators.all()
    await this.routesFileGenerator.all()
  }
}

if (isMain(import.meta.url)) {
  await AllGenerators.fromEnv().generate()

  Log.ok('All done')
}
