import ImageKit from 'imagekit'
import dotenv from 'dotenv'
import { FileObject } from 'imagekit/dist/libs/interfaces'
import * as fs from 'fs'

dotenv.config()

const { IMAGEKIT_URL, IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY } = process.env
if (!IMAGEKIT_URL || !IMAGEKIT_PUBLIC_KEY || !IMAGEKIT_PRIVATE_KEY) {
  console.error('Either ImageKit URL, public key or private key is missing')
  console.error('Add them to the .env file and try again')
  process.exit(1)
}

const imagekit = new ImageKit({
  urlEndpoint: IMAGEKIT_URL,
  publicKey: IMAGEKIT_PUBLIC_KEY,
  privateKey: IMAGEKIT_PRIVATE_KEY,
})

const projectImages: { [id: string]: ProjectImages } = {}
const images = { projects: projectImages }

interface ProjectImages {
  preview: ReducedFileObject[]
}

const PROJECTS_PATH = 'projects'
const projectFileObjects = await imagekit.listFiles({
  includeFolder: true,
  path: PROJECTS_PATH,
})
console.info('Found %d project directories', projectFileObjects.length)
projectFileObjects.forEach((projectFileObject) => {
  console.log(' - %s', projectFileObject.name)
})
console.log('')

const PREVIEWS_DIR = 'preview'
for (const projectFileObject of projectFileObjects) {
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

  const reducedPreviewFileObjects = projectPreviewFileObjects.map(
    (projectPreviewFileObject) => ({
      name: projectPreviewFileObject.name,
      url: projectPreviewFileObject.url,
      height: projectPreviewFileObject.height,
      width: projectPreviewFileObject.width,
    }),
  )
  projectImages[projectFileObject.name] = {
    preview: reducedPreviewFileObjects,
  }
  console.log('')
}

console.log('⚙️  Writing images list JSON')
fs.writeFileSync('src/images.json', JSON.stringify(images, null, 2))
console.info('✅  Done')

type FolderObject = Pick<
  FileObject,
  'type' | 'name' | 'createdAt' | 'updatedAt'
> & {
  folderId: string
  folderPath: string
}

type ReducedFileObject = Pick<FileObject, 'name' | 'url' | 'height' | 'width'>
