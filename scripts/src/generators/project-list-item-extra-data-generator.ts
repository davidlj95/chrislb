import { Resource } from '../resources/resource'
import { ImageAsset } from '../../../src/app/common/images/image-asset'
import { ListItemExtraData } from '../../../src/app/projects/project-list-item'
import { Log } from '../utils/log'
import { Project } from '../../../src/app/projects/project'
import previewJson from '../../../src/data/assets-collections/preview.json' assert { type:
  'json' }
import { groupBy, isEmpty, isUndefined } from 'lodash-es'
import { ProjectImageAsset } from '../../../src/app/projects/project-page/project-image-asset'

export class ProjectListItemExtraDataGenerator {
  private readonly PREVIEW_IMAGES_DIRECTORY = previewJson.slug
  private _imagesResource?: Resource | null
  private _imagesByGroups?: ImagesByGroups

  constructor(
    public readonly resource: Resource,
    public readonly imagesBasename: string,
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
    if (isUndefined(this._imagesByGroups)) {
      const images = await this.getImages()
      this._imagesByGroups = {
        preview: [],
        others: [],
        ...groupBy(images, (image): keyof ImagesByGroups =>
          this.isPreviewImage(image) ? 'preview' : 'others',
        ),
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
    if (isUndefined(this._imagesResource)) {
      const imagesResource =
        (await this.resource.childCollection.getResource(
          this.imagesBasename,
        )) ?? null
      if (!imagesResource) {
        Log.warn('No image resource found')
      }
      this._imagesResource = imagesResource
    }
    return this._imagesResource
  }

  private isPreviewImage(image: ImageAsset): boolean {
    const projectImageAsset = new ProjectImageAsset(image, this.resource.slug)
    return projectImageAsset.collection === this.PREVIEW_IMAGES_DIRECTORY
  }

  private async hasDetails(): Promise<boolean> {
    const conditions = await Promise.all([
      this.hasOtherImagesApartFromPreview(),
      this.hasVideos(),
    ])
    return conditions.some((condition) => condition)
  }

  private async hasOtherImagesApartFromPreview(): Promise<boolean> {
    return !isEmpty((await this.getImagesByGroups()).others)
  }

  private async hasVideos(): Promise<boolean> {
    const project = (await this.resource.getData()) as Project
    return !isEmpty(project.youtubePlaylistId?.trim())
  }

  private async removePreviewImages(): Promise<void> {
    const imagesResource = await this.getImagesResource()
    if (!imagesResource) {
      return
    }
    Log.info('Removing preview images from list')
    const imageGroups = await this.getImagesByGroups()
    await this.resource.childCollection.upsertResource(
      this.imagesBasename,
      imageGroups.others,
    )
  }
}

interface ImagesByGroups {
  readonly preview: ReadonlyArray<ImageAsset>
  readonly others: ReadonlyArray<ImageAsset>
}
