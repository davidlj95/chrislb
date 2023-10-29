export function getListFilename(directory: string) {
  return addJsonExtension(`${directory}-list`)
}

export function getImagesFilename(name: string) {
  return addJsonExtension(`${name}-images`)
}

export function addJsonExtension(filename: string): string {
  return `${filename}.json`
}

//👇 Actually used by scripts
export const PREVIEW_IMAGES_FILENAME = getImagesFilename('preview')
export const LOOKBOOKS_IMAGES_FILENAME = getImagesFilename('lookbooks')
export const TECH_MATERIAL_IMAGES_FILENAME = getImagesFilename('tech-material')
