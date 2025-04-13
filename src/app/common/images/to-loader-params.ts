import { Pipe, PipeTransform } from '@angular/core'
import { areBreakpointsUnsigned, ResponsiveImage } from './image'

@Pipe({ name: 'toLoaderParams', pure: true })
export class ToLoaderParams implements PipeTransform {
  transform = toLoaderParams
}

export const toLoaderParams = ({ breakpoints }: ResponsiveImage) => ({
  signaturesByBreakpoint: areBreakpointsUnsigned(breakpoints)
    ? undefined
    : breakpoints,
})
