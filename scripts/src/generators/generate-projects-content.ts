import { Imagekit } from '../images/imagekit'
import { isMain } from '../utils/is-main'
import { Log } from '../utils/log'
import { ImageCdnApi } from '../images/image-cdn-api'
import PREVIEW_PRESET_JSON from '../../../data/cms/album-presets/preview.json'
import LOOKBOOKS_PRESET_JSON from '../../../data/cms/album-presets/lookbooks.json'
import ALBUM_PRESETS_ORDER_JSON from '../../../data/cms/misc/album-presets-order.json'
import { ImageAsset } from '../../../src/app/common/images/image-asset'
import {
  ProjectAlbum,
  ProjectCms,
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
  ALBUM_PRESETS_PATH,
  CMS_DATA_PATH,
  CONTENT_PATH,
  GENERATED_DATA_PATH,
  PROJECTS_CONTENT_PATH,
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
  const cmsProjectFiles = await listJsonFilesInDirectory(
    join(CMS_DATA_PATH, PROJECTS_DIR),
  )
  const imagekitApi = Imagekit.fromEnv()
  const projectContents: ProjectContent[] = []
  for (const cmsProjectFile of cmsProjectFiles) {
    projectContents.push(
      await mapCmsProjectToProjectContent(imagekitApi, cmsProjectFile),
    )
  }
  return projectContents
}

const mapCmsProjectToProjectContent = async (
  imageCdnApi: ImageCdnApi,
  cmsProjectFile: string,
): Promise<ProjectContent> => {
  const cmsProject = await readJson<ProjectCms>(cmsProjectFile)
  const images = await imageCdnApi.getAllImagesInPath(
    `${PROJECTS_DIR}/${cmsProject.slug}`,
    true,
  )
  const projectImages = images.map(
    (image) => new ProjectImageAsset(image, cmsProject.slug),
  )
  const previewImages = projectImages
    .filter(isPreviewImage)
    .map((projectImage) => projectImage.asset)
  if (!previewImages.length) {
    throw new Error(`Project ${cmsProject.slug} has no preview images`)
  }
  const imagesByAlbumPresetSlug = Object.groupBy(
    projectImages.filter((projectImage) => !isPreviewImage(projectImage)),
    (projectImage) => projectImage.presetSlug,
  )
  const albumPresetsFile = join(
    GENERATED_DATA_PATH,
    appendJsonExtension(basename(ALBUM_PRESETS_PATH)),
  )
  const albumPresets = await readJson<readonly AlbumPreset[]>(albumPresetsFile)
  const albums: readonly ProjectAlbum[] = Object.entries(
    imagesByAlbumPresetSlug,
  )
    .map<readonly ProjectAlbumWithPresetSlug[]>(
      ([presetSlug, projectImages]) => {
        const isLookbooks = presetSlug === LOOKBOOKS_PRESET_JSON.slug
        const images = projectImages!.map((projectImage) => projectImage.asset)
        const preset = albumPresets.find(({ slug }) => presetSlug === slug)
        if (!preset) {
          Log.warn(
            `Skipping ${cmsProject.slug} project album ${presetSlug} path in CDN. It is not a recognized album preset`,
          )
          return []
        }
        if (!isLookbooks) {
          const imagesWithinSubdirs = projectImages!.filter(
            ({ subdir }) => subdir,
          )
          if (imagesWithinSubdirs.length) {
            Log.warn(
              `${cmsProject.slug} project album ${presetSlug} path has images inside subdirectories. That's not expected though. Ignoring for now anyway`,
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
          (projectImage) => projectImage.subdir,
        )
        return Object.entries(
          projectImagesByLookbook,
        ).map<ProjectAlbumWithPresetSlug>(([lookbookSlug, projectImages]) => {
          const lookbookIndex = cmsProject.lookbookNamesAndSlugs!.findIndex(
            (lookbookNameAndSlug) => lookbookNameAndSlug.slug === lookbookSlug,
          )
          if (lookbookIndex === -1) {
            throw new Error(
              `No title for named lookbook ${lookbookSlug} in project ${cmsProject.slug}`,
            )
          }
          const lookbookNameAndSlug =
            cmsProject.lookbookNamesAndSlugs![lookbookIndex]
          return {
            title: `${LOOKBOOKS_PRESET_JSON.name} ${lookbookIndex + 1} "${lookbookNameAndSlug.name}"`,
            images: projectImages!.map((projectImage) => projectImage.asset),
            size: LOOKBOOKS_PRESET_JSON.size as ProjectAlbum['size'],
            presetSlug: LOOKBOOKS_PRESET_JSON.slug,
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
          ALBUM_PRESETS_ORDER_JSON.albumPresetsOrder.indexOf(preset)
        if (presetIndex === -1) {
          throw new Error(
            `Can't sort ${cmsProject.slug} album with preset ${preset}. Cannot find position for preset`,
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
  const { lookbookNamesAndSlugs, ...contentProjectJsonBase } = cmsProject
  return {
    ...contentProjectJsonBase,
    previewImages,
    albums,
  }
}

interface AlbumPreset {
  readonly name: string
  readonly slug: string
  readonly size: ProjectAlbum['size']
}

export class ProjectImageAsset {
  private _relativeFilePath?: string

  constructor(
    readonly asset: ImageAsset,
    readonly projectSlug: string,
  ) {}

  get presetSlug(): string {
    const relativeFilePathParts = this.relativeFilePath.split('/')
    if (relativeFilePathParts.length < 2) {
      return ''
    }
    return relativeFilePathParts[0]
  }

  get subdir(): string {
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

const isPreviewImage = (projectImage: ProjectImageAsset) =>
  projectImage.presetSlug === PREVIEW_PRESET_JSON.slug

const isCustomLookbookAlbum = (album: ProjectAlbumWithPresetSlug) =>
  album.presetSlug === LOOKBOOKS_PRESET_JSON.slug && album.title

export type ProjectContent = Omit<ProjectCms, 'lookbookNamesAndSlugs'> & {
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
  await mkdir(PROJECTS_CONTENT_PATH, { recursive: true })
  return Promise.all(projectsContents.map(generateProjectDetail))
}

const generateProjectDetail = (projectContent: ProjectContent) => {
  if (!hasDetails(projectContent)) {
    return
  }
  return writeJson(
    join(PROJECTS_CONTENT_PATH, appendJsonExtension(projectContent.slug)),
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
