import { LookbookNameAndSlug } from './lookbook-name-and-slug'
import { Credit } from './credit'
import { ImageAsset } from '../common/images/image-asset'

export interface Project {
  readonly slug: string
  readonly date: string
  readonly title: string
  readonly subtitle: string
  readonly quote?: string
  readonly description: string
  readonly youtubePlaylistId?: string
  readonly lookbookNamesAndSlugs?: readonly LookbookNameAndSlug[]
  //👇 When hasn't been set, CMS doesn't set the property
  //   CMS sets it after though (if adding & removing)
  readonly credits?: readonly Credit[]
}

export interface ProjectData {
  readonly slug: string
  readonly date: string
  readonly title: string
  readonly subtitle: string
  readonly quote?: string
  readonly description: string
  readonly youtubePlaylistId?: string
  readonly lookbookNamesAndSlugs?: readonly LookbookNameAndSlug[]
  //👇 When hasn't been set, CMS doesn't set the property
  //   CMS sets it after though (if adding & removing)
  readonly credits?: readonly Credit[]
}

export type ProjectListItem = Omit<
  ProjectData,
  'date' | 'lookbookNamesAndSlugs' | 'albums' | 'youtubePlaylistId'
> & {
  previewImages: readonly ImageAsset[]
  hasDetails: boolean
}

export type ProjectDetail = Pick<ProjectData, 'title' | 'youtubePlaylistId'> & {
  readonly albums?: readonly ProjectAlbum[]
} & Partial<Pick<ProjectData, 'description' | 'quote'>>

export interface ProjectAlbum {
  title: string
  images: readonly ImageAsset[]
  size: 'half' | 'full'
}
