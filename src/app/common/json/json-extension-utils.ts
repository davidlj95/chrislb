export const appendJsonExtension = (basename: string): string =>
  `${basename}${JSON_EXTENSION}`

export const appendJsonExtensionIfNeeded = (filename: string): string =>
  filename.endsWith(JSON_EXTENSION) ? filename : appendJsonExtension(filename)

export const removeJsonExtension = (filename: string): string =>
  filename.split(JSON_EXTENSION)[0]

export const JSON_EXTENSION = '.json'
