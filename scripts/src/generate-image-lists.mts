import ImageKit from 'imagekit'
import dotenv from 'dotenv'
import { FileObject } from 'imagekit/dist/libs/interfaces'
import * as fs from 'fs'
import imagesConfigPkg from '../../src/data/images/config.js'
import { ImageAsset } from '../../src/data/images/types.js'
import * as url from 'url'
import { fileURLToPath } from 'url'
import path from 'path'

const { IMAGEKIT_URL } = imagesConfigPkg

async function generateImageLists() {
  const imagekit = getImagekit()
  await generateLogoImagesList(imagekit)
  await generateProjectsPreviewImagesList(imagekit)
}

async function generateLogoImagesList(imagekit: ImageKit) {
  console.info('Looking for logo images')
  const LOGOS_PATH = 'logos'
  const logoFileObjects = await imagekit.listFiles({ path: LOGOS_PATH })
  if (logoFileObjects.length === 0) {
    console.error("No logo files found within path '%s'", LOGOS_PATH)
    process.exit(1)
  }
  console.log('Found %d logo files', logoFileObjects.length)

  const HORIZONTAL_LOGO_FILENAME = 'horizontal.png'
  console.info(
    "Looking for horizontal logo image ('%s')",
    HORIZONTAL_LOGO_FILENAME,
  )
  const horizontalLogoFileObject = logoFileObjects.find((fileObject) =>
    fileObject.filePath.endsWith(HORIZONTAL_LOGO_FILENAME),
  )
  if (!horizontalLogoFileObject) {
    console.error(
      "Horizontal logo file with name '%s' could not be found",
      HORIZONTAL_LOGO_FILENAME,
    )
    process.exit(1)
  }

  console.info('✅  Horizontal logo found')
  const logoImages: { [id: string]: ImageAsset } = {
    horizontal: imageAssetFromFileObject(horizontalLogoFileObject),
  }
  writeData(logoImages, 'logos.json')
  console.info('✅  Logo images list done')
  console.log('')
}

async function generateProjectsPreviewImagesList(imagekit: ImageKit) {
  const PROJECTS_PATH = 'projects'
  console.info("Looking for project directories inside '%s'", PROJECTS_PATH)
  const projectFileObjects = await imagekit.listFiles({
    includeFolder: true,
    path: PROJECTS_PATH,
  })
  if (projectFileObjects.length === 0) {
    console.error(
      "No project directories found within path '%s'",
      PROJECTS_PATH,
    )
    process.exit(1)
  }
  console.info('Found %d project directories', projectFileObjects.length)
  projectFileObjects.forEach((projectFileObject) => {
    console.log(' - %s', projectFileObject.name)
  })
  console.log('')

  const PREVIEWS_DIR = 'preview'
  const projectsPreviewImages: {
    [id: string]: ReadonlyArray<ImageAsset>
  } = Object.fromEntries(
    await Promise.all(
      projectFileObjects.map(async (projectFileObject) => {
        const projectFolderObject = projectFileObject as unknown as FolderObject
        console.info(
          "Finding preview images of project '%s' ('%s')",
          projectFolderObject.name,
          projectFolderObject.folderPath,
        )
        const projectPreviewFileObjects = await imagekit.listFiles({
          path: `${projectFolderObject.folderPath}/${PREVIEWS_DIR}`,
          sort: 'ASC_NAME',
        })
        console.log(' - Found %d images', projectPreviewFileObjects.length)
        console.log('')

        return [
          projectFileObject.name,
          projectPreviewFileObjects.map(imageAssetFromFileObject),
        ]
      }),
    ),
  )
  writeData(projectsPreviewImages, 'projects-preview.json')
  console.info('✅  Projects preview images done')
  console.log('')
}

function getImagekit(): ImageKit {
  dotenv.config()

  const { IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY } = process.env
  if (!IMAGEKIT_PUBLIC_KEY || !IMAGEKIT_PRIVATE_KEY) {
    console.error('Either ImageKit URL, public key or private key is missing')
    console.error('Add them to the .env file and try again')
    process.exit(1)
  }

  return new ImageKit({
    urlEndpoint: IMAGEKIT_URL,
    publicKey: IMAGEKIT_PUBLIC_KEY,
    privateKey: IMAGEKIT_PRIVATE_KEY,
  })
}

function imageAssetFromFileObject(fileObject: FileObject): ImageAsset {
  return {
    name: fileObject.name,
    filePath: fileObject.filePath,
    height: fileObject.height,
    width: fileObject.width,
    alt: (fileObject.customMetadata as CustomMetadata)?.alt,
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

function writeData(data: object, filename: string): void {
  fs.writeFileSync(
    path.join(IMAGES_DATA_DIR, filename),
    JSON.stringify(data, null, 2),
  )
}

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export function getRepositoryRootDir() {
  return path.resolve(__dirname, '..', '..')
}

const IMAGES_DATA_DIR = path.join(
  getRepositoryRootDir(),
  'src',
  'data',
  'images',
)

/**
 * isMain(import.meta.url)
 * https://2ality.com/2022/07/nodejs-esm-main.html
 */
export function isMain(importMetaUrl: string) {
  const modulePath = url.fileURLToPath(importMetaUrl)
  return process.argv[1] === modulePath
}

if (isMain(import.meta.url)) {
  await generateImageLists()
  console.info('✅  Done')
}
