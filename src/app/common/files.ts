export function getListFilename(directory: string) {
  return addJsonExtension(directory)
}

export function addJsonExtension(filename: string): string {
  return `${filename}.json`
}
