import { Inject, Injectable, InjectionToken } from '@angular/core'
import projects from '../../../data/projects.json'
import images from '../../../data/images.json'
import { ProjectItem } from './project-item/project-item'

@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  constructor(
    @Inject(PROJECTS_JSON) private projectsJson: JsonProjects,
    @Inject(IMAGES_JSON) private imagesJson: JsonImages,
  ) {}

  async getProjects(): Promise<ReadonlyArray<ProjectItem>> {
    return this.projectsJson.map((projectJson) => ({
      ...projectJson,
      previewImages: this.getPreviewImagesForProject(projectJson.id),
    }))
  }

  getPreviewImagesForProject(id: string) {
    if (!this.isImageProjectId(id)) {
      console.warn("No preview images found for project id '%s'", id)
      return []
    }
    return this.imagesJson.projects[id]?.preview
  }

  isImageProjectId(id: string): id is ImageProjectIds {
    return Object.keys(this.imagesJson.projects).includes(id)
  }
}

const PROJECTS_JSON = new InjectionToken<JsonProjects>('Projects JSON', {
  factory: () => projects,
})
const IMAGES_JSON = new InjectionToken<JsonImages>('Images JSON', {
  factory: () => images,
})
type JsonProjects = typeof projects
type JsonImages = typeof images
type ImageProjectIds = keyof typeof images.projects
