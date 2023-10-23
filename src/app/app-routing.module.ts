import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { ROUTES } from './routes'

@NgModule({
  imports: [
    RouterModule.forRoot(ROUTES, {
      initialNavigation: 'enabledBlocking',
      bindToComponentInputs: true,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
