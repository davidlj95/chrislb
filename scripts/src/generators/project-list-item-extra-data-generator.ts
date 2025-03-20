import { Resource } from '../resources/resource'
import { ImageAsset } from '../../../src/app/common/images/image-asset'
import { ListItemExtraData } from '../../../src/app/projects/project-list-item'
import { Log } from '../utils/log'
import { Project } from '../../../src/app/projects/project'
import previewJson from '../../../src/data/assets-collections/preview.json'
import { groupBy, isEmpty, isUndefined } from 'lodash-es'
import { ProjectImageAsset } from '../../../src/app/projects/project-detail-page/project-image-asset'

export class ProjectListItemExtraDataGenerator {
  private _imagesResource?: Resource | null
  private _imagesByGroups?: ImagesByGroups

  constructor(
    readonly resource: Resource,
    readonly imagesBasename: string,
  ) {}

  async generate(): Promise<ListItemExtraData> {
    const imageGroups = await this._getImagesByGroups()
    Log.info(
      'Found %d preview images and %d other images',
      imageGroups.preview.length,
      imageGroups.others.length,
    )
    const hasDetails = await this._hasDetails()
    Log.info('Setting has detail view to %s', hasDetails)
    const listItemExtraData: ListItemExtraData = {
      previewImages: imageGroups.preview,
      hasContent: hasDetails,
    }
    await this._removePreviewImages()
    return listItemExtraData
  }

  private async _getImagesByGroups(): Promise<ImagesByGroups> {
    if (isUndefined(this._imagesByGroups)) {
      const images = await this._getImages()
      this._imagesByGroups = {
        preview: [],
        others: [],
        ...groupBy(images, (image): keyof ImagesByGroups =>
          this._isPreviewImage(image) ? 'preview' : 'others',
        ),
      }
    }
    return this._imagesByGroups
  }

  private async _getImages(): Promise<readonly ImageAsset[]> {
    const imagesResource = await this._getImagesResource()
    if (!imagesResource) {
      return []
    }
    return (await imagesResource.read()) as readonly ImageAsset[]
  }

  private async _getImagesResource(): Promise<Resource | null> {
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

  private _isPreviewImage(image: ImageAsset): boolean {
    const projectImageAsset = new ProjectImageAsset(image, this.resource.slug)
    return projectImageAsset.collection === PREVIEW_IMAGES_DIRECTORY
  }

  private async _hasDetails(): Promise<boolean> {
    const conditions = await Promise.all([
      this._hasOtherImagesApartFromPreview(),
      this._hasVideos(),
    ])
    return conditions.some((condition) => condition)
  }

  private async _hasOtherImagesApartFromPreview(): Promise<boolean> {
    return !isEmpty((await this._getImagesByGroups()).others)
  }

  private async _hasVideos(): Promise<boolean> {
    const project = (await this.resource.read()) as Project
    return !isEmpty(project.youtubePlaylistId?.trim())
  }

  private async _removePreviewImages(): Promise<void> {
    const imagesResource = await this._getImagesResource()
    if (!imagesResource) {
      return
    }
    Log.info('Removing preview images from list')
    const imageGroups = await this._getImagesByGroups()
    await this.resource.childCollection.upsertResource(
      this.imagesBasename,
      imageGroups.others,
    )
  }
}

interface ImagesByGroups {
  readonly preview: readonly ImageAsset[]
  readonly others: readonly ImageAsset[]
}

const PREVIEW_IMAGES_DIRECTORY = previewJson.slug
