import { ImageAsset } from '../../common/images/image-asset'
import { PROJECTS_DIR } from '../../common/directories'

export class ProjectImageAsset {
  private _relativeFilePath?: string

  constructor(
    public readonly asset: ImageAsset,
    private readonly projectSlug: string,
  ) {}

  public get collection(): string {
    const relativeFilePathParts = this.relativeFilePath.split('/')
    if (relativeFilePathParts.length < 2) {
      return ''
    }
    return relativeFilePathParts[0]
  }

  public get subCollection(): string {
    const relativeFilePathParts = this.relativeFilePath.split('/')
    if (relativeFilePathParts.length < 3) {
      return ''
    }
    return relativeFilePathParts[1]
  }

  public get relativeFilePath() {
    if (!this._relativeFilePath) {
      this._relativeFilePath = this.asset.filePath
        .replace(/^\//, '')
        .replace(new RegExp(`^${PROJECTS_DIR}/`), '')
        .replace(new RegExp(`^${this.projectSlug}/`), '')
    }
    return this._relativeFilePath
  }
}
