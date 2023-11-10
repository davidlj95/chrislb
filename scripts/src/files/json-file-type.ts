import { FileType } from './file-type'
import { JsonFile } from './json-file'

export const JSON_FILE_TYPE = new FileType('.json', JsonFile, JsonFile)
