import { DataType } from './data-type.mjs'
import { JsonFile } from './json-file.mjs'

export const JSON_DATA_TYPE = new DataType('.json', JsonFile, JsonFile)
