import { JsonMetadata } from './json-metadata'
import { RouteData } from './route-data'
import { getMetadataFromJson } from './get-metadata-from-json'

export function makeRouteMetadadata(
  jsonMetadata: JsonMetadata,
  ...paths: string[]
): RouteData {
  return {
    NgaoxSeo: getMetadataFromJson(jsonMetadata, ...paths),
  }
}
