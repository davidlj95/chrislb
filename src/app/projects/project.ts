import { Credit } from './credit'
import { ImageAsset } from '../common/images/image-asset'

export interface CmsProject {
  readonly slug: string
  readonly date: string
  readonly title: string
  readonly subtitle: string
  readonly quote?: string
  readonly description: string
  readonly youtubePlaylistId?: string
  //👇 When hasn't been set, CMS doesn't set the property
  //   CMS sets it after though (if adding & removing)
  readonly credits?: readonly Credit[]
  readonly albums?: readonly CmsProjectAlbum[]
}

export interface CmsProjectAlbum {
  readonly presetSlug: string
  readonly subdirectory?: string
  readonly customTitle?: string
}

export type ProjectListItem = Omit<
  CmsProject,
  'date' | 'lookbookNamesAndSlugs' | 'albums' | 'youtubePlaylistId'
> & {
  previewImages: readonly ImageAsset[]
  hasDetails: boolean
}

export type ProjectDetail = Pick<CmsProject, 'title' | 'youtubePlaylistId'> & {
  readonly albums?: readonly ProjectDetailAlbum[]
} & Partial<Pick<CmsProject, 'description' | 'quote'>>

export interface ProjectDetailAlbum {
  title: string
  images: readonly ImageAsset[]
  //👇 Keep in sync with CMS
  size: 'half' | 'full'
}
