import { ImageAsset } from '../../common/images/image-asset'
import { PROJECTS_DIR } from '../../common/directories'

export class ProjectImageAsset {
  private _relativeFilePath?: string

  constructor(
    readonly asset: ImageAsset,
    readonly projectSlug: string,
  ) {}

  get collection(): string {
    const relativeFilePathParts = this.relativeFilePath.split('/')
    if (relativeFilePathParts.length < 2) {
      return ''
    }
    return relativeFilePathParts[0]
  }

  get subCollection(): string {
    const relativeFilePathParts = this.relativeFilePath.split('/')
    if (relativeFilePathParts.length < 3) {
      return ''
    }
    return relativeFilePathParts[1]
  }

  get relativeFilePath() {
    if (!this._relativeFilePath) {
      this._relativeFilePath = this.asset.filePath
        .replace(/^\//, '')
        .replace(new RegExp(`^${PROJECTS_DIR}/`), '')
        .replace(new RegExp(`^${this.projectSlug}/`), '')
    }
    return this._relativeFilePath
  }
}
