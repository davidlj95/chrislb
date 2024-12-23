import { Component } from '@angular/core'
import { Resume } from './resume'
import { ResumeService } from './resume.service'
import { faFilePdf } from '@fortawesome/free-solid-svg-icons'
import { FaIconComponent } from '@fortawesome/angular-fontawesome'

@Component({
  selector: 'app-resume',
  templateUrl: './resume.component.html',
  styleUrls: ['./resume.component.scss'],
  standalone: true,
  imports: [FaIconComponent],
  providers: [ResumeService],
})
export class ResumeComponent {
  public readonly resumes: readonly Resume[]

  constructor(resumeService: ResumeService) {
    this.resumes = resumeService.getAll()
  }

  protected readonly faFilePdf = faFilePdf
}
