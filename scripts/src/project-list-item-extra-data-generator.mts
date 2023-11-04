import { Resource } from './resource.mjs'
import { ImageAsset } from '../../src/app/common/images/types.js'
import { ResourceImagesGenerator } from './resource-images-generator.mjs'
import {
  ListItemExtraData,
  Project,
} from '../../src/app/projects-page/project-item/project-item.js'
import { Log } from './log.mjs'

export class ProjectListItemExtraDataGenerator {
  private readonly PREVIEW_IMAGES_DIRECTORY = 'preview'
  private _imagesResource?: Resource | null
  private _imagesByGroups?: ImagesByGroups

  constructor(
    public readonly resource: Resource,
    public readonly resourceImagesGenerator: ResourceImagesGenerator,
  ) {}

  public async generate(): Promise<ListItemExtraData> {
    const imageGroups = await this.getImagesByGroups()
    Log.info(
      'Found %d preview images and %d other images',
      imageGroups.preview.length,
      imageGroups.others.length,
    )
    const hasDetails = await this.hasDetails()
    Log.info('Setting has detail view to %s', hasDetails)
    const listItemExtraData: ListItemExtraData = {
      previewImages: imageGroups.preview,
      hasContent: hasDetails,
    }
    await this.removePreviewImages()
    return listItemExtraData
  }

  private async getImagesByGroups(): Promise<ImagesByGroups> {
    if (!this._imagesByGroups) {
      const images = await this.getImages()
      const preview: ImageAsset[] = []
      const others: ImageAsset[] = []
      for (const image of images) {
        this.isPreviewImage(image.filePath)
          ? preview.push(image)
          : others.push(image)
      }
      this._imagesByGroups = {
        preview,
        others,
      }
    }
    return this._imagesByGroups
  }

  private async getImages(): Promise<ReadonlyArray<ImageAsset>> {
    const imagesResource = await this.getImagesResource()
    if (!imagesResource) {
      return []
    }
    return (await imagesResource.getData()) as ReadonlyArray<ImageAsset>
  }

  private async getImagesResource(): Promise<Resource | null> {
    if (this._imagesResource === undefined) {
      const imagesResource =
        (await this.resource.childCollection.getResource(
          this.resourceImagesGenerator.basename,
        )) ?? null
      if (!imagesResource) {
        Log.warn('No image resource found')
      }
      this._imagesResource = imagesResource
    }
    return this._imagesResource
  }

  private isPreviewImage(imageFilePath: string): boolean {
    return this.getRelativeImageFilePath(imageFilePath).startsWith(
      this.PREVIEW_IMAGES_DIRECTORY,
    )
  }

  private getRelativeImageFilePath(imageFilePath: string): string {
    const imageFilePathWithoutBaseSlash = imageFilePath.startsWith('/')
      ? imageFilePath.substring(1)
      : imageFilePath
    return imageFilePathWithoutBaseSlash.substring(
      // +1 to take into account the slash
      this.resource.relativePath.length + 1,
    )
  }

  private async hasDetails(): Promise<boolean> {
    const conditions = await Promise.all([
      this.hasOtherImagesApartFromPreview,
      this.hasVideos,
    ])
    return conditions.some((condition) => condition)
  }

  private async hasOtherImagesApartFromPreview(): Promise<boolean> {
    return (await this.getImagesByGroups()).others.length > 0
  }

  private async hasVideos(): Promise<boolean> {
    const project = (await this.resource.getData()) as Project
    return !!project.youtubePlaylistId
  }

  private async removePreviewImages(): Promise<void> {
    const imagesResource = await this.getImagesResource()
    if (!imagesResource) {
      return
    }
    Log.info('Removing preview images from list')
    const imageGroups = await this.getImagesByGroups()
    await this.resource.childCollection.upsertResource(
      this.resourceImagesGenerator.basename,
      imageGroups.others,
    )
  }
}

interface ImagesByGroups {
  readonly preview: ReadonlyArray<ImageAsset>
  readonly others: ReadonlyArray<ImageAsset>
}
