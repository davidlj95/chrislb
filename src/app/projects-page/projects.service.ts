import { Injectable } from '@angular/core'
import { JsonFetcher } from '../common/json-fetcher/json-fetcher-injection-token'
import { PROJECTS_DIR } from '../common/directories'
import { addJsonExtension, getListFilename } from '../common/files'
import { Project, ProjectListItem } from './project-item/project-item'

@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  constructor(private jsonFetcher: JsonFetcher) {}

  async getAll(): Promise<ReadonlyArray<ProjectListItem>> {
    const listItems = await this.jsonFetcher.fetch(
      getListFilename(PROJECTS_DIR),
    )
    return (listItems as ReadonlyArray<ProjectListItem> | undefined) ?? []
  }

  async bySlug(slug: string): Promise<Project | undefined> {
    const project = await this.jsonFetcher.fetch(
      PROJECTS_DIR,
      addJsonExtension(slug),
    )
    return project as Project | undefined
  }
}
