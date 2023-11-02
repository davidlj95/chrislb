import { IPageSeoData } from '@ngaox/seo'
import defaultMetadata from '../data/misc/metadata.json'
import notFoundPageMetadata from '../data/pages/404.json'
import projectsPageMetadata from '../data/pages/projects.json'
import aboutPageMetadata from '../data/pages/about.json'

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
