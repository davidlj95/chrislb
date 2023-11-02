import { IPageSeoData } from '@ngaox/seo'
import defaultMetadata from '../data/misc/metadata.json'
import notFoundPageMetadata from '../data/pages/404.json'
import projectsPageMetadata from '../data/pages/projects.json'
import aboutPageMetadata from '../data/pages/about.json'
import { Author } from './common/authors.service'
import { MetaDefinition } from '@angular/platform-browser'

export const PROJECTS_PATH = projectsPageMetadata.slug
export const NOT_FOUND_PATH = notFoundPageMetadata.slug
export const ABOUT_PATH = aboutPageMetadata.slug

type RouteData = {
  NgaoxSeo?: IPageSeoData
}

export interface JsonMetadata {
  readonly name: string
  readonly title: string
  readonly description: string
  readonly keywords?: string[] | undefined
  readonly image?:
    | {
        readonly url: string
        readonly alt: string
        readonly width: number
        readonly height: number
        readonly mimeType: string
      }
    | undefined
}

export function makeRouteMetadadata(
  jsonMetadata: JsonMetadata,
  ...paths: string[]
): RouteData {
  return {
    NgaoxSeo: getMetadataFromJson(jsonMetadata, ...paths),
  }
}

export function getMetadataFromJson(
  jsonMetadata: JsonMetadata,
  ...pathSegments: string[]
): IPageSeoData {
  return {
    ...jsonMetadata,
    url: getCanonicalUrlForPath(...pathSegments),
    title: getTitle(jsonMetadata.title),
    keywords:
      !!jsonMetadata.keywords && jsonMetadata.keywords.length
        ? jsonMetadata.keywords.join(', ')
        : undefined,
  }
}

export function addOpenGraphProfileMetadataFromAuthor(
  metadata: IPageSeoData,
  author: Author,
): IPageSeoData {
  const extras: MetaDefinition[] = []
  if (author.firstName && author.firstName.length > 0) {
    extras.push({
      property: 'og:profile:first_name',
      content: author.firstName,
    })
  }
  if (author.lastName && author.lastName.length > 0) {
    extras.push({
      property: 'og:profile:last_name',
      content: author.lastName,
    })
  }
  if (author.gender && author.gender.length > 0) {
    extras.push({
      property: 'og:profile:gender',
      content: author.gender,
    })
  }
  if (author.social?.mainUsername && author.social.mainUsername.length > 0) {
    extras.push({
      property: 'og:profile:username',
      content: author.social.mainUsername,
    })
  }

  return {
    ...metadata,
    type: 'profile',
    extra: [...(metadata.extra ?? []), ...extras],
  }
}

export function getTitle(title: string) {
  if (!title || title.length === 0) {
    return defaultMetadata.siteName
  }
  return `${title} | ${defaultMetadata.siteName}`
}

export function getCanonicalUrlForPath(...pathSegments: ReadonlyArray<string>) {
  return new URL(
    pathSegments.join('/'),
    new URL(defaultMetadata.canonicalUrl),
  ).toString()
}
