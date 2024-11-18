import { ImageAsset } from '../common/images/image-asset'
import { Project } from './project'

export type ProjectListItem = Project & ListItemExtraData

export interface ListItemExtraData {
  readonly previewImages?: readonly ImageAsset[]
  readonly hasContent: boolean
}
