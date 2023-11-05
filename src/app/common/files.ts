export function getListFilename(directory: string) {
  return addJsonExtension(directory)
}

export function addJsonExtension(filename: string): string {
  return `${filename}.json`
}

export const IMAGES_FILE_BASENAME = 'images'
export const IMAGES_FILENAME = addJsonExtension(IMAGES_FILE_BASENAME)
