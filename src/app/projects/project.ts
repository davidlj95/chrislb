import { LookbookNameAndSlug } from './lookbook-name-and-slug'
import { Credit } from './credit'

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
  readonly credits?: ReadonlyArray<Credit>
}
