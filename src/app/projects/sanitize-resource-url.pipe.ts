import { Pipe, PipeTransform } from '@angular/core'
import { DomSanitizer } from '@angular/platform-browser'

@Pipe({
  name: 'sanitizeResourceUrl',
  standalone: true,
})
export class SanitizeResourceUrlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string | URL): unknown {
    return this.sanitizer.bypassSecurityTrustResourceUrl(value.toString())
  }
}
