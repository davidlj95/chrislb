import { Component } from '@angular/core'
import { ProjectItem } from './project-item/project-item'

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
})
export class ProjectsComponent {
  public readonly ASSETS_PATH = 'assets/projects'
  public readonly items: ReadonlyArray<ProjectItem> = [
    {
      title: 'CHIASMA',
      subtitle: 'Final graduate collection',
      quote:
        'Crossing path of two organic structures, usually the bridge in the recombination process',
      description: [
        `The collection explores hybrid identity. Chiasma means “crossing of two structures”. It shows my personal experience as a second generation immigrant who has grown up between two different cultures. My latin heritage, being born in Peru, and being raised in Spain, has led me to develop an ego that combines these two worlds in one. This experience, which is shared by many people nowadays, is redefining new identities and social principles. This project brings to the surface these experiences by exploring different acculturation profiles that are known in the process of cultural adaptation and identity development.`,
        `The masculine ego reflected in the collection is stoic and sophisticated. It is a striking ego, so outwear garments are elemental pieces and traditional masculine silhouettes are predominant. The fluidity of identity is represented through nuanced colours and prints with ethnic cultural origins. The different garments finishings, laser cutting and eyelets being the main ones, emphasize the separation between the individual identity and the collective one to see how they mix and how this cultural hybridization that I speak about is produced.`,
      ],
      credits: [
        {
          role: 'Designer, Creative Director',
          name: 'Christian Lázaro',
          nickname: 'christian_labu',
        },
        {
          role: 'Photographer',
          name: 'Alejandro Flama',
          nickname: 'flama.ph',
        },
      ],
      images: new Array(15)
        .fill(0)
        .map(
          (x, i) =>
            `${this.ASSETS_PATH}/chiasma/preview/chiasma_1${(i + 1)
              .toString()
              .padStart(2, '0')}.jpg`,
        ),
    },
  ]
}
