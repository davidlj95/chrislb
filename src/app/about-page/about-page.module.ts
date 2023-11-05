import { NgModule } from '@angular/core'
import { CommonModule, NgOptimizedImage } from '@angular/common'
import { AboutPageComponent } from './about-page.component'
import { SocialComponent } from './social/social.component'
import { ResumeComponent } from './resume/resume.component'
import { AboutPageRoutingModule } from './about-page-routing.module'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { ResumeService } from './resume/resume.service'

@NgModule({
  declarations: [AboutPageComponent, SocialComponent, ResumeComponent],
  imports: [
    CommonModule,
    AboutPageRoutingModule,
    FontAwesomeModule,
    NgOptimizedImage,
  ],
  providers: [ResumeService],
})
export class AboutPageModule {}
