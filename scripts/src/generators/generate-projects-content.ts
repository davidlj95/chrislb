import { Imagekit } from '../images/imagekit'
import { isMain } from '../utils/is-main'
import { Log } from '../utils/log'
import { ImageCdnApi } from '../images/image-cdn-api'
import { ProjectImageAsset } from '../../../src/app/projects/project-detail-page/project-image-asset'
import PREVIEW_JSON from '../../../src/data/assets-collections/preview.json'
import LOOKBOOK_JSON from '../../../src/data/assets-collections/lookbook.json'
import LOOKBOOKS_JSON from '../../../src/data/assets-collections/lookbooks.json'
import ASSETS_COLLECTIONS_ORDER_JSON from '../../../src/data/misc/assets-collections-order.json'
import { ImageAsset } from '../../../src/app/common/images/image-asset'
import {
  ProjectAlbum,
  ProjectData,
  ProjectDetail,
  ProjectListItem,
} from '../../../src/app/projects/project'
import { basename, join } from 'path'
import { mkdir } from 'fs/promises'
import {
  appendJsonExtension,
  listJsonFilesInDirectory,
  readJson,
  writeJson,
} from '../utils/json'
import {
  ASSETS_COLLECTIONS_PATH,
  CONTENT_PATH,
  DATA_PATH,
} from '../utils/paths'
import { PROJECTS_DIR } from '../../../src/app/common/directories'

export const generateProjectsContent = async () => {
  const projectsContents = await mapProjectsDataToProjectsContents()
  await generateProjectsList(projectsContents)
  await generateProjectsDetails(projectsContents)
}

// Adds images and removes unneeded fields after processing (currently just lookbook names)
const mapProjectsDataToProjectsContents = async (): Promise<
  readonly ProjectContent[]
> => {
  const dataProjectFiles = await listJsonFilesInDirectory(
    join(DATA_PATH, PROJECTS_DIR),
  )
  const imagekitApi = Imagekit.fromEnv()
  const projectContents: ProjectContent[] = []
  for (const dataProjectFile of dataProjectFiles) {
    projectContents.push(
      await mapProjectDataToProjectContent(imagekitApi, dataProjectFile),
    )
  }
  return projectContents
}

const mapProjectDataToProjectContent = async (
  imageCdnApi: ImageCdnApi,
  dataProjectFile: string,
): Promise<ProjectContent> => {
  const dataProject = await readJson<ProjectData>(dataProjectFile)
  const images = await imageCdnApi.getAllImagesInPath(
    `${PROJECTS_DIR}/${dataProject.slug}`,
    true,
  )
  const projectImages = images.map(
    (image) => new ProjectImageAsset(image, dataProject.slug),
  )
  const previewImages = projectImages
    .filter(isPreviewImage)
    .map((projectImage) => projectImage.asset)
  if (!previewImages.length) {
    throw new Error(`Project ${dataProject.slug} has no preview images`)
  }
  const imagesByAlbum = Object.groupBy(
    projectImages.filter((projectImage) => !isPreviewImage(projectImage)),
    (projectImage) => projectImage.collection,
  )
  const assetsCollectionsFile = join(
    ASSETS_COLLECTIONS_PATH,
    '..',
    appendJsonExtension(basename(ASSETS_COLLECTIONS_PATH)),
  )
  const assetsCollectionsJson = await readJson<readonly AssetCollection[]>(
    assetsCollectionsFile,
  )
  const albums: readonly ProjectAlbum[] = Object.entries(imagesByAlbum)
    .map<readonly ProjectAlbumWithPresetSlug[]>(
      ([collection, projectImages]) => {
        const isLookbooks = collection === LOOKBOOKS_JSON.slug
        const images = projectImages!.map((projectImage) => projectImage.asset)
        const preset = assetsCollectionsJson.find(
          ({ slug }) => collection === slug,
        )
        if (!preset) {
          Log.warn(
            `Skipping ${dataProject.slug} project album ${collection} path in CDN. It is not a recognized asset collection`,
          )
          return []
        }
        if (!isLookbooks) {
          const imagesWithSubcollections = projectImages!.filter(
            ({ subCollection }) => subCollection,
          )
          if (imagesWithSubcollections.length) {
            Log.warn(
              `${dataProject.slug} project album ${collection} path has images inside subdirectories. That's not expected though. Ignoring for now anyway`,
            )
          }
          return [
            {
              title: preset.name,
              images,
              size: preset.size as ProjectAlbum['size'],
              presetSlug: preset.slug,
            },
          ]
        }
        const projectImagesByLookbook = Object.groupBy(
          projectImages!,
          (projectImage) => projectImage.subCollection,
        )
        return Object.entries(
          projectImagesByLookbook,
        ).map<ProjectAlbumWithPresetSlug>(([lookbookSlug, projectImages]) => {
          const lookbookIndex = dataProject.lookbookNamesAndSlugs!.findIndex(
            (lookbookNameAndSlug) => lookbookNameAndSlug.slug === lookbookSlug,
          )
          if (lookbookIndex === -1) {
            throw new Error(
              `No title for named lookbook ${lookbookSlug} in project ${dataProject.slug}`,
            )
          }
          const lookbookNameAndSlug =
            dataProject.lookbookNamesAndSlugs![lookbookIndex]
          return {
            title: `${LOOKBOOKS_JSON.name} ${lookbookIndex + 1} "${lookbookNameAndSlug.name}"`,
            images: projectImages!.map((projectImage) => projectImage.asset),
            size: LOOKBOOKS_JSON.size as ProjectAlbum['size'],
            presetSlug: LOOKBOOKS_JSON.slug,
          }
        })
      },
    )
    .flat()
    .sort((albumA, albumB) => {
      if (isCustomLookbookAlbum(albumA) && isCustomLookbookAlbum(albumB)) {
        //👇 Given title contains index. Won't work for <9 looks
        return albumA.title < albumB.title ? -1 : 1
      }
      const [albumAPresetIndex, albumBPresetIndex] = [
        albumA.presetSlug,
        albumB.presetSlug,
      ].map((preset) => {
        const presetIndex =
          ASSETS_COLLECTIONS_ORDER_JSON.assetCollectionsOrder.findIndex(
            (assetSlug) => assetSlug === preset,
          )
        if (presetIndex === -1) {
          throw new Error(
            `Can't sort ${dataProject.slug} album with preset ${preset}. Cannot find position for preset`,
          )
        }
        return presetIndex
      })
      return albumAPresetIndex - albumBPresetIndex
    })
    .map<ProjectAlbum>((albumWithPreset) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { presetSlug, ...albumWithoutPreset } = albumWithPreset
      return albumWithoutPreset
    })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { lookbookNamesAndSlugs, ...contentProjectJsonBase } = dataProject
  return {
    ...contentProjectJsonBase,
    previewImages,
    albums,
  }
}

interface AssetCollection {
  readonly name: string
  readonly slug: string
  readonly size: ProjectAlbum['size']
}

const isPreviewImage = (projectImage: ProjectImageAsset) =>
  projectImage.collection === PREVIEW_JSON.slug

const isCustomLookbookAlbum = (album: ProjectAlbumWithPresetSlug) =>
  album.presetSlug === LOOKBOOK_JSON.slug && album.title

export type ProjectContent = Omit<ProjectData, 'lookbookNamesAndSlugs'> & {
  readonly previewImages: readonly ImageAsset[]
  readonly albums: readonly ProjectAlbum[]
}

export type ProjectAlbumWithPresetSlug = ProjectAlbum & { presetSlug: string }

const generateProjectsList = async (
  projectsContents: readonly ProjectContent[],
) => {
  const projectListItems = projectsContents
    .map<ProjectListItem & Pick<ProjectContent, 'date'>>((projectContent) => {
      //👇 To remove unneeded props, they are assigned but unused
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { albums, youtubePlaylistId, ...baseProjectListItem } =
        projectContent
      return {
        ...baseProjectListItem,
        hasDetails: hasDetails(projectContent),
      }
    })
    .sort(
      (projectA, projectB) =>
        new Date(projectB.date).getTime() - new Date(projectA.date).getTime(),
    )
    .map<ProjectListItem>((projectListItemWithDate) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { date, ...projectListItem } = projectListItemWithDate
      return projectListItem
    })
  await mkdir(CONTENT_PATH, { recursive: true })
  await writeJson(
    join(CONTENT_PATH, appendJsonExtension(PROJECTS_DIR)),
    projectListItems,
  )
}

export const hasDetails = (projectContent: ProjectContent) =>
  !!projectContent.youtubePlaylistId || !!projectContent.albums.length

const generateProjectsDetails = async (
  projectsContents: readonly ProjectContent[],
) => {
  await mkdir(join(CONTENT_PATH, PROJECTS_DIR), { recursive: true })
  return Promise.all(projectsContents.map(generateProjectDetail))
}

const generateProjectDetail = (projectContent: ProjectContent) => {
  if (!hasDetails(projectContent)) {
    return
  }
  return writeJson(
    join(CONTENT_PATH, PROJECTS_DIR, appendJsonExtension(projectContent.slug)),
    mapProjectContentToProjectDetails(projectContent),
  )
}

const mapProjectContentToProjectDetails = (
  projectContent: ProjectContent,
): ProjectDetail => {
  const { title, quote, description, youtubePlaylistId, albums } =
    projectContent
  return {
    title,
    quote,
    description: quote ? undefined : description,
    youtubePlaylistId,
    albums: albums.length ? albums : undefined,
  }
}

if (isMain(import.meta.url)) {
  await generateProjectsContent()
  Log.ok('All done')
}
