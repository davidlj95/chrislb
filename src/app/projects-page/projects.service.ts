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
    return this.jsonFetcher.fetch(getListFilename(PROJECTS_DIR))
  }

  async bySlug(slug: string): Promise<Project> {
    return this.jsonFetcher.fetch(PROJECTS_DIR, addJsonExtension(slug))
  }
}
