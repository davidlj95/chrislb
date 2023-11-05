import defaultMetadata from '../../../data/misc/metadata.json'

export function getCanonicalUrlForPath(...pathSegments: ReadonlyArray<string>) {
  return new URL(
    pathSegments.join('/'),
    new URL(defaultMetadata.canonicalUrl),
  ).toString()
}
