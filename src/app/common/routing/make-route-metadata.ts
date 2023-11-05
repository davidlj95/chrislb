import { JsonMetadata } from './json-metadata'
import { getMetadataFromJson } from './get-metadata-from-json'
import { IPageSeoData } from '@ngaox/seo'

type RouteData = {
  NgaoxSeo?: IPageSeoData
}

export function makeRouteMetadadata(
  jsonMetadata: JsonMetadata,
  ...paths: string[]
): RouteData {
  return {
    NgaoxSeo: getMetadataFromJson(jsonMetadata, ...paths),
  }
}
