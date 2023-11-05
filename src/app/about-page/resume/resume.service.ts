import { Injectable } from '@angular/core'
import aboutPage from '../../../data/misc/about.json'
import { Resume } from './resume'

@Injectable()
export class ResumeService {
  public getAll(): ReadonlyArray<Resume> {
    return aboutPage.resume
  }
}
