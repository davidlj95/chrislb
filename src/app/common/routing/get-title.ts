import defaultMetadata from '@/data/cms/misc/metadata.json'

export function getTitle(pageTitle: string | undefined | null) {
  if (!pageTitle?.trim()) {
    return defaultMetadata.siteName
  }
  return `${pageTitle} | ${defaultMetadata.siteName}`
}
