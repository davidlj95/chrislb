import { Inject, Injectable, InjectionToken } from '@angular/core'
import projectsList from '../../data/projects-list.json'
import { ProjectItem } from './project-item/project-item'

@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  constructor(
    @Inject(PROJECTS_LIST_JSON) private projectsListJson: ProjectsListJson,
  ) {}

  async getAll(): Promise<ReadonlyArray<ProjectItem>> {
    return this.projectsListJson
  }

  async bySlug(slug: string): Promise<ProjectItem | null> {
    return (
      this.projectsListJson.find((project) => project.slug === slug) ?? null
    )
  }
}

const PROJECTS_LIST_JSON = new InjectionToken<ProjectsListJson>(
  'Projects JSON',
  {
    factory: () => projectsList,
  },
)

type ProjectsListJson = typeof projectsList
