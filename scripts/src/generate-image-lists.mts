import ImageKit from 'imagekit'
import dotenv from 'dotenv'
import { FileObject } from 'imagekit/dist/libs/interfaces'
import { mkdir } from 'fs/promises'
import imagesConfigPkg from '../../src/data/images/config.js'
import { ImageAsset, LogoImages } from '../../src/data/images/types.js'
import path from 'path'
import { isMain } from './is-main.mjs'
import { getRepositoryRootDir } from './get-repository-root-dir.mjs'
import { Log } from './log.mjs'
import directoriesPkg from '../../src/app/common/directories.js'
import { Lookbook } from '../../src/app/project-page/lookbook.js'
import filesPkg from '../../src/app/common/files.js'
import { JsonFile } from './json-file.mjs'

const { IMAGEKIT_URL } = imagesConfigPkg
const { DATA_DIR, PROJECTS_DIR, CONTENTS_DIR } = directoriesPkg
const {
  LOOKBOOKS_IMAGES_FILENAME,
  PREVIEW_IMAGES_FILENAME,
  TECH_MATERIAL_IMAGES_FILENAME,
  DESIGN_BOOK_IMAGES_FILENAME,
} = filesPkg

class ImageListsGenerator {
  private imageKit: ImageKit
  private readonly SRC_DIR = path.join(getRepositoryRootDir(), 'src')
  private readonly IMAGES_DATA_DIR = path.join(this.SRC_DIR, DATA_DIR, 'images')
  private readonly PROJECTS_CONTENTS_DIR = path.join(
    this.SRC_DIR,
    CONTENTS_DIR,
    PROJECTS_DIR,
  )

  constructor() {
    this.imageKit = ImageListsGenerator.getImageKit()
  }

  private static getImageKit(): ImageKit {
    dotenv.config()

    const { IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY } = process.env
    if (!IMAGEKIT_PUBLIC_KEY || !IMAGEKIT_PRIVATE_KEY) {
      Log.error('Either ImageKit URL, public key or private key is missing')
      Log.error(
        'Add them to the .env file or as environment variables and try again',
      )
      process.exit(1)
    }

    return new ImageKit({
      urlEndpoint: IMAGEKIT_URL,
      publicKey: IMAGEKIT_PUBLIC_KEY,
      privateKey: IMAGEKIT_PRIVATE_KEY,
    })
  }

  public async all(): Promise<void> {
    await this.logos()
    const projects = await this.projects()
    await this.projectsLookbooksImages(projects)
    await this.projectsDirectoryImageAssets({
      projectFolderObjects: projects,
      directory: 'preview',
      name: 'preview images',
      filename: PREVIEW_IMAGES_FILENAME,
    })
    await this.projectsDirectoryImageAssets({
      projectFolderObjects: projects,
      directory: 'tech-material',
      name: 'tech material images',
      filename: TECH_MATERIAL_IMAGES_FILENAME,
    })
    await this.projectsDirectoryImageAssets({
      projectFolderObjects: projects,
      directory: 'design-book',
      name: 'design book images',
      filename: DESIGN_BOOK_IMAGES_FILENAME,
    })
  }

  private async logos(): Promise<void> {
    Log.group('Logo images')
    const LOGOS_PATH = 'logos'
    const logoFileObjects = await this.imageKit.listFiles({ path: LOGOS_PATH })
    if (logoFileObjects.length === 0) {
      Log.error("No logo files found within path '%s'", LOGOS_PATH)
      process.exit(1)
    }
    Log.info('Found %d logo files', logoFileObjects.length)

    const HORIZONTAL_LOGO_FILENAME = 'horizontal.png'
    Log.info(
      "Looking for horizontal logo image ('%s')",
      HORIZONTAL_LOGO_FILENAME,
    )
    const horizontalLogoFileObject = logoFileObjects.find((fileObject) =>
      fileObject.filePath.endsWith(HORIZONTAL_LOGO_FILENAME),
    )
    if (!horizontalLogoFileObject) {
      Log.error(
        "Horizontal logo file with name '%s' could not be found",
        HORIZONTAL_LOGO_FILENAME,
      )
      process.exit(1)
    }

    Log.ok('Horizontal logo found')
    const logoImages: LogoImages = {
      horizontal: this.imageAssetFromFileObject(horizontalLogoFileObject),
    }
    await new JsonFile(path.join(this.IMAGES_DATA_DIR, 'logos.json')).write(
      logoImages,
    )
    Log.ok('Done')
    Log.groupEnd()
  }

  private async projects(): Promise<ReadonlyArray<FolderObject>> {
    const PROJECTS_PATH = 'projects'
    Log.group("Project directories (inside '%s')", PROJECTS_PATH)
    const projectFileObjects = await this.imageKit.listFiles({
      includeFolder: true,
      path: PROJECTS_PATH,
    })
    if (projectFileObjects.length === 0) {
      Log.error("No project directories found within path '%s'", PROJECTS_PATH)
      process.exit(1)
    }
    Log.info('Found %d project directories', projectFileObjects.length)
    projectFileObjects.forEach((projectFileObject) => {
      Log.item(projectFileObject.name)
    })
    Log.ok('Done')
    Log.groupEnd()
    return projectFileObjects as unknown as ReadonlyArray<FolderObject>
  }

  private async projectsLookbooksImages(
    projectFolderObjects: ReadonlyArray<FolderObject>,
  ) {
    Log.group('Projects lookbooks images')
    for (const projectFolderObject of projectFolderObjects) {
      const LOOKBOOKS_DIR = 'lookbooks'
      Log.info(
        "Finding lookbooks of project '%s' ('%s')",
        projectFolderObject.name,
        projectFolderObject.folderPath,
      )
      const lookbooksFileObjects = await this.imageKit.listFiles({
        path: `${projectFolderObject.folderPath}/${LOOKBOOKS_DIR}`,
        includeFolder: true,
        sort: 'ASC_NAME',
      })
      const lookbooksFolderObjects =
        lookbooksFileObjects as unknown as ReadonlyArray<FolderObject>
      if (lookbooksFolderObjects.length < 1) {
        Log.warn(
          "No lookbooks found for project '%s'",
          projectFolderObject.name,
        )
        continue
      }
      Log.item('Found %d lookbooks', lookbooksFolderObjects.length)
      const lookbooks: Lookbook[] = []
      for (const lookbookFolderObject of lookbooksFolderObjects) {
        Log.group(
          "Project '%s' lookbook '%s' images",
          projectFolderObject.name,
          lookbookFolderObject.name,
        )
        const lookbookFileObjects = await this.imageKit.listFiles({
          path: lookbookFolderObject.folderPath,
          sort: 'ASC_NAME',
        })
        if (lookbooksFileObjects.length < 1) {
          Log.warn("No images for lookbook '%s'", lookbookFolderObject.name)
        } else {
          Log.item('Found %d images', lookbookFileObjects.length)
        }
        lookbooks.push({
          slug: this.removeOrderPrefix(lookbookFolderObject.name),
          images: lookbookFileObjects.map(this.imageAssetFromFileObject),
        })
        Log.groupEnd()
      }
      const projectAssetsDirectory = await this.makeProjectDirectory(
        projectFolderObject.name,
      )
      Log.info('Writing lookbooks for project %s', projectFolderObject.name)
      await new JsonFile(
        path.join(projectAssetsDirectory, LOOKBOOKS_IMAGES_FILENAME),
      ).write(lookbooks)
    }
    Log.ok('Done')
    Log.groupEnd()
  }

  private async projectsDirectoryImageAssets({
    projectFolderObjects,
    directory,
    name,
    filename,
  }: {
    projectFolderObjects: ReadonlyArray<FolderObject>
    directory: string
    name: string
    filename: string
  }): Promise<void> {
    Log.group('Projects %s assets', name)
    for (const projectFolderObject of projectFolderObjects) {
      const project = this.removeOrderPrefix(projectFolderObject.name)
      Log.info(
        "Finding %s of project '%s' ('%s')",
        name,
        project,
        projectFolderObject.folderPath,
      )
      const assetFileObjects = await this.imageKit.listFiles({
        path: `${projectFolderObject.folderPath}/${directory}`,
        sort: 'ASC_NAME',
      })
      if (assetFileObjects.length < 1) {
        Log.warn("No %s found for project '%s'", name, project)
        continue
      }
      Log.item('Found %d assets', assetFileObjects.length)
      const projectAssetsDirectory = await this.makeProjectDirectory(project)
      Log.item('Writing %s file %s', name, path.join(project, filename))
      const assetsFile = path.join(projectAssetsDirectory, filename)
      await new JsonFile(assetsFile).write(
        assetFileObjects.map(this.imageAssetFromFileObject),
      )
      break
    }
    Log.ok('Done')
    Log.groupEnd()
  }

  private imageAssetFromFileObject(fileObject: FileObject): ImageAsset {
    return {
      name: fileObject.name,
      filePath: fileObject.filePath,
      height: fileObject.height,
      width: fileObject.width,
      alt: (fileObject.customMetadata as CustomMetadata)?.alt,
    }
  }

  private async makeProjectDirectory(slug: string): Promise<string> {
    const projectDirectory = path.join(this.PROJECTS_CONTENTS_DIR, slug)
    await mkdir(projectDirectory, { recursive: true })
    return projectDirectory
  }

  private removeOrderPrefix(name: string): string {
    return name.replace(/^\d+-/, '')
  }
}

type FolderObject = Pick<
  FileObject,
  'type' | 'name' | 'createdAt' | 'updatedAt'
> & {
  folderId: string
  folderPath: string
}

type CustomMetadata = {
  alt?: string
}

if (isMain(import.meta.url)) {
  const imageListsGenerator = new ImageListsGenerator()
  await imageListsGenerator.all()
  Log.ok('All done')
}
