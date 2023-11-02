import { Injectable } from '@angular/core'
import { JsonFetcher } from '../common/json-fetcher/json-fetcher'
import { PROJECTS_DIR } from '../common/directories'
import { addJsonExtension, getListFilename } from '../common/files'
import { Project, ProjectListItem } from './project-item/project-item'

@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  constructor(private jsonFetcher: JsonFetcher) {}

  async getAll(): Promise<ReadonlyArray<ProjectListItem>> {
    const projects = await this.jsonFetcher.fetch<
      ReadonlyArray<ProjectListItem>
    >(getListFilename(PROJECTS_DIR))
    return Array.from(projects).sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    )
  }

  async bySlug(slug: string): Promise<Project> {
    return this.jsonFetcher.fetch(PROJECTS_DIR, addJsonExtension(slug))
  }
}
