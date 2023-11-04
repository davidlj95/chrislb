import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { NOT_FOUND_PATH } from '../routes'
import { noop } from 'rxjs'

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
