import { FileType } from './file-type.mts'
import { JsonFile } from './json-file.mts'

export const JSON_FILE_TYPE = new FileType('.json', JsonFile, JsonFile)
