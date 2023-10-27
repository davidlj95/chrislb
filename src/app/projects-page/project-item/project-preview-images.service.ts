import { Inject, Injectable, InjectionToken } from '@angular/core'
import { ImageAsset, ImageAssetsBySlug } from '../../../data/images/types'
import projectsPreviewImages from '../../../data/images/projects-preview.json'

@Injectable({
  providedIn: 'root',
})
export class ProjectPreviewImagesService {
  constructor(
    @Inject(PREVIEW_IMAGES_BY_PROJECT_SLUG)
    private previewImagesByProjectSlug: ImageAssetsBySlug,
  ) {}

  async bySlug(slug: string): Promise<ReadonlyArray<ImageAsset>> {
    return this.previewImagesByProjectSlug[slug] ?? []
  }
}

const PREVIEW_IMAGES_BY_PROJECT_SLUG = new InjectionToken<ImageAssetsBySlug>(
  'Preview images by project slug',
  {
    factory: () => projectsPreviewImages,
  },
)
