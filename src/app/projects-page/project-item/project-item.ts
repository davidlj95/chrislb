import { ImageAsset } from '../../common/images/types'

export interface Project {
  readonly slug: string
  readonly date: string
  readonly title: string
  readonly subtitle: string
  readonly quote?: string
  readonly description: string
  readonly youtubePlaylistId?: string
  readonly lookbookNamesAndSlugs?: ReadonlyArray<LookbookNameAndSlug>
  //👇 When hasn't been set, CMS doesn't set the property
  //   CMS sets it after though (if adding & removing)
  readonly credits?: readonly Credit[]
}

export interface LookbookNameAndSlug {
  readonly slug: string
  readonly name: string
}

export interface ProjectListItem extends Project {
  readonly previewImages?: ReadonlyArray<ImageAsset>
  readonly hasContent: boolean
}

export interface Credit {
  readonly role: string
  readonly authorSlug: string
}
