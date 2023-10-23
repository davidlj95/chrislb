import { Inject, Injectable, InjectionToken } from '@angular/core'
import projects from '../../data/projects.json'
import { ProjectItem } from './project-item/project-item'

@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  constructor(@Inject(PROJECTS_JSON) private projectsJson: JsonProjects) {}

  async getProjects(): Promise<ReadonlyArray<ProjectItem>> {
    return this.projectsJson
  }
}

const PROJECTS_JSON = new InjectionToken<JsonProjects>('Projects JSON', {
  factory: () => projects,
})

type JsonProjects = typeof projects
