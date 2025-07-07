import { Pipe, PipeTransform, inject } from '@angular/core'
import { DomSanitizer } from '@angular/platform-browser'

@Pipe({ name: 'sanitizeResourceUrl' })
export class SanitizeResourceUrlPipe implements PipeTransform {
  private readonly _sanitizer = inject(DomSanitizer)

  transform(value: string | URL): unknown {
    return this._sanitizer.bypassSecurityTrustResourceUrl(value.toString())
  }
}
