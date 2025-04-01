import { isMain } from '../utils/is-main'
import { Log } from '../utils/log'
import { ImageCdnApi } from '../images/image-cdn-api'
import PREVIEW_PRESET_JSON from '../../../data/cms/album-presets/preview.json'
import { ResponsiveImage } from '../../../src/app/common/images/responsive-image'
import {
  CmsProject,
  CmsProjectCredit,
  ProjectDetail,
  ProjectDetailAlbum,
  ProjectListItem,
  ProjectListItemCredit,
} from '../../../src/app/projects/project'
import { join } from 'path'
import { mkdir } from 'fs/promises'
import {
  appendJsonExtension,
  listJsonFilesInDirectory,
  readJson,
  writeJson,
} from '../utils/json'
import {
  ALBUM_PRESETS_PATH,
  AUTHORS_PATH,
  CMS_DATA_PATH,
  CONTENT_PATH,
  PROJECTS_CONTENT_PATH,
} from '../utils/paths'
import { PROJECTS_DIR } from '../../../src/app/common/directories'
import { CmsAuthorSocial } from '../../../src/app/common/social'
import { getImageCdnApi } from '../images/get-image-cdn-api'

export const generateProjectsContent = async () => {
  const expandedCmsProjects = await expandCmsProjects()
  await generateProjectsList(expandedCmsProjects)
  await generateProjectsDetails(expandedCmsProjects)
}

// Adds images, reads other assets to provide the frontend app just the info it will need
// Both for list and for details. That will be split in a later step.
const expandCmsProjects = async (): Promise<readonly ExpandedCmsProject[]> => {
  const cmsProjectFiles = await listJsonFilesInDirectory(
    join(CMS_DATA_PATH, PROJECTS_DIR),
  )
  const imageCdnApi = getImageCdnApi()
  const expandedCmsProjects: ExpandedCmsProject[] = []
  for (const cmsProjectFile of cmsProjectFiles) {
    expandedCmsProjects.push(
      await expandCmsProject(
        await readJson<CmsProject>(cmsProjectFile),
        imageCdnApi,
      ),
    )
  }
  return expandedCmsProjects
}

const expandCmsProject = async (
  cmsProject: CmsProject,
  imageCdnApi: ImageCdnApi,
): Promise<ExpandedCmsProject> => {
  Log.info('Expanding project "%s"', cmsProject.slug)
  const projectImageDirectory = `${PROJECTS_DIR}/${cmsProject.slug}`
  const previewImages = await imageCdnApi.getAllImagesInPath(
    `${projectImageDirectory}/${PREVIEW_PRESET_JSON.slug}`,
  )
  if (!previewImages.length) {
    throw new Error(`Project ${cmsProject.slug} has no preview images`)
  }
  const albums: ProjectDetailAlbum[] = []
  for (const cmsProjectAlbum of cmsProject.albums ?? []) {
    const preset = await readJson<CmsAlbumPreset>(
      join(ALBUM_PRESETS_PATH, appendJsonExtension(cmsProjectAlbum.presetSlug)),
    )
    const albumPresetImageDirectory = `${projectImageDirectory}/${preset.slug}`
    const albumImageDirectory = cmsProjectAlbum.subdirectory
      ? `${albumPresetImageDirectory}/${cmsProjectAlbum.subdirectory}`
      : albumPresetImageDirectory
    const images = await imageCdnApi.getAllImagesInPath(
      albumImageDirectory,
      false,
    )
    const albumsWithSamePreset = (cmsProject.albums ?? []).filter(
      (album) => album.presetSlug === cmsProjectAlbum.presetSlug,
    )
    const albumIndex = albumsWithSamePreset.indexOf(cmsProjectAlbum) + 1
    const title =
      albumsWithSamePreset.length > 1
        ? cmsProjectAlbum.customTitle
          ? `${preset.name} ${albumIndex} "${cmsProjectAlbum.customTitle}"`
          : `${preset.name} ${albumIndex}`
        : cmsProjectAlbum.customTitle
          ? `${preset.name} "${cmsProjectAlbum.customTitle}"`
          : preset.name
    albums.push({
      title,
      images,
      size: preset.size,
    })
  }
  return {
    ...cmsProject,
    previewImages,
    albums,
  }
}

interface CmsAlbumPreset {
  readonly name: string
  readonly slug: string
  readonly size: ProjectDetailAlbum['size']
}

export type ExpandedCmsProject = Omit<CmsProject, 'albums'> & {
  readonly previewImages: readonly ResponsiveImage[]
  readonly albums: readonly ProjectDetailAlbum[]
}

const generateProjectsList = async (
  expandedCmsProjects: readonly ExpandedCmsProject[],
) => {
  const projectListItems = (
    await Promise.all(
      expandedCmsProjects.map<
        Promise<ProjectListItem & Pick<ExpandedCmsProject, 'date'>>
      >(async (expandedCmsProject) => {
        //👇 To remove unneeded props, they are assigned but unused
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { credits, albums, youtubePlaylistId, ...baseProjectListItem } =
          expandedCmsProject
        const listItemCredits = await Promise.all(
          (credits ?? []).map(mapCmsProjectCreditToProjectListItemCredit),
        )
        return {
          ...baseProjectListItem,
          credits: listItemCredits.length ? listItemCredits : undefined,
          hasDetails: hasDetails(expandedCmsProject),
        }
      }),
    )
  )
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

const hasDetails = (projectContent: ExpandedCmsProject) =>
  !!projectContent.youtubePlaylistId || !!projectContent.albums.length

const mapCmsProjectCreditToProjectListItemCredit = async (
  cmsProjectCredit: CmsProjectCredit,
): Promise<ProjectListItemCredit> => {
  const author = await readJson<CmsAuthor>(
    join(AUTHORS_PATH, appendJsonExtension(cmsProjectCredit.authorSlug)),
  )
  const social = author.social
    ? getPreferredSocialRef(author.social)
    : undefined
  return {
    role: cmsProjectCredit.role,
    name: author.name,
    social,
  }
}

const getPreferredSocialRef = (
  social: CmsAuthorSocial,
): ProjectListItemCredit['social'] | undefined => {
  const { preferred, ...usernamesByNetSlug } = social
  if (preferred && Object.keys(social).indexOf(preferred) > -1) {
    const username = new Map<string, string>(Object.entries(social)).get(
      preferred,
    )!
    return {
      netSlug: preferred,
      username,
    }
  }
  const netSlugsAndNames = Object.entries(usernamesByNetSlug) as readonly [
    keyof CmsAuthorSocial,
    string,
  ][]
  if (!netSlugsAndNames.length) {
    return
  }
  const preferredNetSlugAndUsername = netSlugsAndNames.toSorted(
    (netSlugAndUsernameA, netSlugAndUsernameB) =>
      SOCIAL_NETS_DEFAULT_PREFS.get(netSlugAndUsernameA[0])! -
      SOCIAL_NETS_DEFAULT_PREFS.get(netSlugAndUsernameB[0])!,
  )[0]
  return {
    netSlug: preferredNetSlugAndUsername[0],
    username: preferredNetSlugAndUsername[1],
  }
}

const SOCIAL_NETS_DEFAULT_PREFS = new Map<keyof CmsAuthorSocial, number>(
  (['instagram', 'linkedin', 'tiktok'] as const).map((netSlug, index) => [
    netSlug,
    index,
  ]),
)

interface CmsAuthor {
  name: string
  social?: CmsAuthorSocial
}

const generateProjectsDetails = async (
  expandedCmsProjects: readonly ExpandedCmsProject[],
) => {
  await mkdir(PROJECTS_CONTENT_PATH, { recursive: true })
  return Promise.all(expandedCmsProjects.map(generateProjectDetail))
}

const generateProjectDetail = (expandedCmsProject: ExpandedCmsProject) => {
  if (!hasDetails(expandedCmsProject)) {
    return
  }
  const { title, quote, description, youtubePlaylistId, albums } =
    expandedCmsProject
  const projectDetail: ProjectDetail = {
    title,
    quote,
    description: quote ? undefined : description,
    youtubePlaylistId,
    albums: albums.length ? albums : undefined,
  }
  return writeJson(
    join(PROJECTS_CONTENT_PATH, appendJsonExtension(expandedCmsProject.slug)),
    projectDetail,
  )
}

if (isMain(import.meta.url)) {
  await generateProjectsContent()
  Log.ok('All done')
}
