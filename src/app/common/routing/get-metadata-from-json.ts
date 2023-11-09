import { IPageSeoData } from '@ngaox/seo'
import { getTitle } from './get-title'
import { JsonMetadata } from './json-metadata'
import { getCanonicalUrlForPath } from './get-canonical-url-for-path'

export function getMetadataFromJson(
  jsonMetadata: JsonMetadata,
  ...pathSegments: string[]
): IPageSeoData {
  return {
    ...jsonMetadata,
    url: getCanonicalUrlForPath(...pathSegments),
    title: getTitle(jsonMetadata.title),
    keywords: jsonMetadata.keywords?.join(', '),
  }
}
