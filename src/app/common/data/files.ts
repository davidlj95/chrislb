export function getListFilename(directory: string) {
  return `${directory}-list.json`
}

export function addJsonExtension(filename: string): string {
  return `${filename}.json`
}
