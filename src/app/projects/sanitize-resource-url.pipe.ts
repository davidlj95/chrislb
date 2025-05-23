import { Pipe, PipeTransform } from '@angular/core'
import { DomSanitizer } from '@angular/platform-browser'

@Pipe({ name: 'sanitizeResourceUrl' })
export class SanitizeResourceUrlPipe implements PipeTransform {
  constructor(private readonly _sanitizer: DomSanitizer) {}

  transform(value: string | URL): unknown {
    return this._sanitizer.bypassSecurityTrustResourceUrl(value.toString())
  }
}
