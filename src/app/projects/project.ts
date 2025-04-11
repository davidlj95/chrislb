import { ResponsiveImage } from '../common/images/image'
import { SocialRef } from '../common/social'

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
  readonly credits?: readonly CmsProjectCredit[]
  readonly albums?: readonly CmsProjectAlbum[]
}

export interface CmsProjectCredit {
  readonly role: string
  readonly authorSlug: string
}

export interface CmsProjectAlbum {
  readonly presetSlug: string
  readonly subdirectory?: string
  readonly customTitle?: string
}

export type ProjectListItem = Omit<
  CmsProject,
  'date' | 'credits' | 'albums' | 'youtubePlaylistId'
> & {
  readonly credits?: readonly ProjectListItemCredit[]
  readonly previewImageSizes: string
  readonly previewImages: readonly ResponsiveImage[]
  readonly hasDetails: boolean
}

export interface ProjectListItemCredit {
  readonly role: string
  readonly name: string
  readonly social?: SocialRef
}

export type ProjectDetail = Pick<CmsProject, 'title' | 'youtubePlaylistId'> & {
  readonly albums?: readonly ProjectDetailAlbum[]
} & Partial<Pick<CmsProject, 'description' | 'quote'>>

export interface ProjectDetailAlbum {
  readonly title: string
  readonly images: readonly ResponsiveImage[]
  readonly imageSizes: string
  //👇 Keep in sync with CMS
  readonly size: 'half' | 'full'
}

export const PROJECT_LIST_ITEM_SLIDES_PER_VIEW = 2
