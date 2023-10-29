import { ImageAsset } from '../../../data/images/types'

export interface Project {
  readonly slug: string
  readonly title: string
  readonly subtitle: string
  readonly quote?: string
  readonly description: string
  readonly credits: readonly Credit[]
}

export interface ProjectListItem extends Project {
  readonly previewImages: ReadonlyArray<ImageAsset>
}

export interface Credit {
  readonly role: string
  readonly authorSlug: string
}
