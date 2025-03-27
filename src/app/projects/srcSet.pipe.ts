import { Pipe, PipeTransform } from '@angular/core'
import {
  DEFAULT_BREAKPOINTS,
  ImageAssetBreakpoints,
} from '../common/images/image-asset'

@Pipe({
  name: 'srcSet',
  standalone: true,
})
export class SrcSetPipe implements PipeTransform {
  transform(value: ImageAssetBreakpoints | undefined): string {
    const breakpoints = value ?? DEFAULT_BREAKPOINTS
    return breakpoints.map((breakpoint) => `${breakpoint}w`).join(', ')
  }
}
