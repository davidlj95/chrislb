import { Injectable } from '@angular/core'
import aboutPage from '../../../data/misc/about.json'
import { Resume } from './resume'

@Injectable({
  providedIn: 'root',
})
export class ResumeService {
  public getAll(): ReadonlyArray<Resume> {
    return aboutPage.resume
  }
}
