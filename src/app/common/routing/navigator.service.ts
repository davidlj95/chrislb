import { Injectable, inject } from '@angular/core'
import { Router } from '@angular/router'
import { noop } from 'rxjs'
import { NOT_FOUND_PATH } from './paths'

@Injectable({
  providedIn: 'root',
})
export class NavigatorService {
  private readonly _router = inject(Router)

  displayNotFoundPage() {
    this._router
      .navigate([NOT_FOUND_PATH], { skipLocationChange: true })
      .then(noop)
  }
}
