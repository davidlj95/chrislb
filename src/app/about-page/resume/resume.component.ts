import { Component } from '@angular/core'
import { faFilePdf } from '@fortawesome/free-solid-svg-icons'
import { FaIconComponent } from '@fortawesome/angular-fontawesome'
import aboutPage from '../../../data/misc/about.json'

@Component({
  selector: 'app-resume',
  templateUrl: './resume.component.html',
  styleUrls: ['./resume.component.scss'],
  standalone: true,
  imports: [FaIconComponent],
})
export class ResumeComponent {
  readonly resumeLinks: readonly ResumeLink[] = aboutPage.resume
  protected readonly faFilePdf = faFilePdf
}

interface ResumeLink {
  displayName: string
  href: string
}
