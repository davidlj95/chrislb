import { Imagekit } from '../images/imagekit'
import { isMain } from '../utils/is-main'
import { Log } from '../utils/log'
import { Collections } from './collections'
import { ImageCdnApi } from '../images/image-cdn-api'
import { Resource } from '../resources/resource'
import { ProjectImageAsset } from '../../../src/app/projects/project-detail-page/project-image-asset'
import PREVIEW_JSON from '../../../src/data/assets-collections/preview.json'
import LOOKBOOK_JSON from '../../../src/data/assets-collections/lookbook.json'
import LOOKBOOKS_JSON from '../../../src/data/assets-collections/lookbooks.json'
import ASSETS_COLLECTIONS_JSON from '../../../src/data/assets-collections.json'
import ASSETS_COLLECTIONS_ORDER_JSON from '../../../src/data/misc/assets-collections-order.json'
import { ImageAsset } from '../../../src/app/common/images/image-asset'
import {
  ProjectAlbum,
  ProjectData,
  ProjectDetail,
  ProjectListItem,
} from '../../../src/app/projects/project'
import { join } from 'path'

const generateProjectsContent = async () => {
  const projectsContents = await mapProjectsDataToProjectsContents()
  await generateProjectsList(projectsContents)
  await generateProjectsDetails(projectsContents)
}

// Adds images and removes unneeded fields after processing (currently just lookbook names)
const mapProjectsDataToProjectsContents = async (): Promise<
  readonly ProjectContent[]
> => {
  const dataProjects = await Collections.dataProjects.getResources()
  const imagekitApi = Imagekit.fromEnv('unpublished')
  const projectContents: ProjectContent[] = []
  for (const dataProject of dataProjects) {
    projectContents.push(
      await mapProjectDataToProjectContent(imagekitApi, dataProject),
    )
  }
  return projectContents
}

const mapProjectDataToProjectContent = async (
  imageCdnApi: ImageCdnApi,
  dataProject: Resource,
): Promise<ProjectContent> => {
  const images = await imageCdnApi.getAllImagesInPath(
    `projects/${dataProject.slug}`,
    true,
  )
  const dataProjectJson = (await dataProject.read()) as ProjectData
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
  const albums: readonly ProjectAlbum[] = Object.entries(imagesByAlbum)
    .map<ProjectAlbum | readonly ProjectAlbum[]>(
      ([collection, projectImages]) => {
        const isLookbooks = collection === LOOKBOOKS_JSON.slug
        const images = projectImages!.map((projectImage) => projectImage.asset)
        if (!isLookbooks) {
          if (!isValidPreset(collection)) {
            Log.warn(
              `Skipping ${dataProject.slug} project album ${collection} path in CDN. It is not a recognized asset collection`,
            )
            return []
          }
          return {
            preset: collection,
            images,
          }
        }
        const projectImagesByLookbook = Object.groupBy(
          projectImages!,
          (projectImage) => projectImage.subCollection,
        )
        return Object.entries(projectImagesByLookbook).map<ProjectAlbum>(
          ([lookbookSlug, projectImages]) => {
            const title = dataProjectJson.lookbookNamesAndSlugs!.find(
              (lookbookNameAndSlug) =>
                lookbookNameAndSlug.slug === lookbookSlug,
            )?.name
            if (!title) {
              throw new Error(
                `No title for named lookbook ${lookbookSlug} in project ${dataProject.slug}`,
              )
            }
            return {
              preset: LOOKBOOK_JSON.slug,
              images: projectImages!.map((projectImage) => projectImage.asset),
              title,
            }
          },
        )
      },
    )
    .flat()
    .sort((albumA, albumB) => {
      if (isCustomLookbookAlbum(albumA) && isCustomLookbookAlbum(albumB)) {
        const [lookbookAIndex, lookbookBIndex] = [
          albumA.title,
          albumB.title,
        ].map((title) => {
          const index = dataProjectJson.lookbookNamesAndSlugs!.findIndex(
            (nameAndSlug) => nameAndSlug.name === title,
          )
          if (index === -1) {
            throw new Error(
              `Can't sort ${dataProject.slug} lookbook album with title ${title}. Position not found`,
            )
          }
          return index
        })
        return lookbookAIndex - lookbookBIndex
      }
      const [albumAPresetIndex, albumBPresetIndex] = [
        albumA.preset,
        albumB.preset,
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { lookbookNamesAndSlugs, ...contentProjectJsonBase } = dataProjectJson
  return {
    ...contentProjectJsonBase,
    previewImages,
    albums,
  }
}

const isPreviewImage = (projectImage: ProjectImageAsset) =>
  projectImage.collection === PREVIEW_JSON.slug

const isCustomLookbookAlbum = (album: ProjectAlbum) =>
  album.preset === LOOKBOOK_JSON.slug && album.title

const isValidPreset = (preset: string) =>
  ASSETS_COLLECTIONS_JSON.some(
    (assetCollection) => assetCollection.slug === preset,
  )

export type ProjectContent = Omit<ProjectData, 'lookbookNamesAndSlugs'> & {
  readonly previewImages?: readonly ImageAsset[]
  readonly albums: readonly ProjectAlbum[]
}

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
  await Collections.contentProjects.fileType.write(
    join(
      Collections.contentProjects.path,
      '..',
      Collections.contentProjects.fileType.appendExtension(
        Collections.contentProjects.name,
      ),
    ),
    projectListItems,
  )
}

export const hasDetails = (projectContent: ProjectContent) =>
  !!projectContent.youtubePlaylistId || !!projectContent.albums.length

const generateProjectsDetails = async (
  projectsContents: readonly ProjectContent[],
) => {
  await Collections.contentProjects.createDirectoryIfDoesNotExist()
  return Promise.all(projectsContents.map(generateProjectDetail))
}

const generateProjectDetail = (projectContent: ProjectContent) => {
  if (!hasDetails(projectContent)) {
    return
  }
  return Collections.contentProjects.upsertResource(
    projectContent.slug,
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
