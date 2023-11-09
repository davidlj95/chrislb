import { DataType } from './data-type.mts'
import { JsonFile } from './json-file.mts'

export const JSON_DATA_TYPE = new DataType('.json', JsonFile, JsonFile)
