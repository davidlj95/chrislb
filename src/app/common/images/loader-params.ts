import { Pipe, PipeTransform } from '@angular/core'
import { areBreakpointsUnsigned, LoaderParams, ResponsiveImage } from './image'

@Pipe({ name: 'toLoaderParams', standalone: true, pure: true })
export class ToLoaderParams implements PipeTransform {
  transform(image: ResponsiveImage): LoaderParams {
    return toLoaderParams(image)
  }
}

export const toLoaderParams = ({ breakpoints }: ResponsiveImage) => ({
  signaturesByBreakpoint: areBreakpointsUnsigned(breakpoints)
    ? undefined
    : breakpoints,
})
