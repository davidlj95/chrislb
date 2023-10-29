import { Component, Input, OnInit } from '@angular/core'
import { ProjectsService } from '../projects-page/projects.service'
import { displayNotFound } from '../common/navigation'
import { Router } from '@angular/router'
import { noop } from 'rxjs'
import { SeoService } from '@ngaox/seo'
import { getCanonicalUrlForPath, getTitle, PROJECTS_PATH } from '../routes'

@Component({
  selector: 'app-project-page',
  templateUrl: './project-page.component.html',
  styleUrls: ['./project-page.component.scss'],
})
export class ProjectPageComponent implements OnInit {
  @Input({ required: true }) public slug!: string

  constructor(
    private projectsService: ProjectsService,
    private router: Router,
    private seo: SeoService,
  ) {}

  ngOnInit(): void {
    this.projectsService.bySlug(this.slug).then((projectItem) => {
      this.seo.setUrl(getCanonicalUrlForPath(PROJECTS_PATH, this.slug))
      if (!projectItem) {
        displayNotFound(this.router).then(noop)
        return
      }
      this.seo.setTitle(getTitle(projectItem.title))
      this.seo.setDescription(projectItem.description)
    })
  }
}
