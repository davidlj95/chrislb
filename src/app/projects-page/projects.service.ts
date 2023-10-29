import { Injectable } from '@angular/core'
import { ProjectItem } from './project-item/project-item'
import { JsonFetcher } from '../common/json-fetcher/json-fetcher-injection-token'
import { PROJECTS_DIR } from '../common/data/directories'
import { getListFilename } from '../common/data/files'

@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  constructor(private jsonFetcher: JsonFetcher) {}

  async getAll(): Promise<ReadonlyArray<ProjectItem>> {
    return (await this.jsonFetcher.fetch(
      getListFilename(PROJECTS_DIR),
    )) as unknown as ReadonlyArray<ProjectItem>
  }

  async bySlug(slug: string): Promise<ProjectItem | null> {
    const allProjects = await this.getAll()
    return allProjects.find((project) => project.slug === slug) ?? null
  }
}
