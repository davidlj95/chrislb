import { Router } from '@angular/router'
import { NOT_FOUND_PATH } from '../routes'

export function displayNotFound(router: Router) {
  return router.navigate([NOT_FOUND_PATH], { skipLocationChange: true })
}
