import { Component } from '@angular/core'
import { LogoImagesService } from './logo-images.service'
import { ImageAsset } from '../../data/images/types'

@Component({
  selector: 'app-logo',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.scss'],
})
export class LogoComponent {
  public readonly horizontal: ImageAsset

  constructor(logoImagesService: LogoImagesService) {
    this.horizontal = logoImagesService.horizontal
  }
}
