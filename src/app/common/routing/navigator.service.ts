import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { noop } from 'rxjs'
import { NOT_FOUND_PATH } from './paths'

@Injectable({
  providedIn: 'root',
})
export class NavigatorService {
  constructor(private router: Router) {}

  displayNotFoundPage() {
    this.router
      .navigate([NOT_FOUND_PATH], { skipLocationChange: true })
      .then(noop)
  }
}
