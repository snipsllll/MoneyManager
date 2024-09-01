import {Component, Input} from '@angular/core';
import {EintragListelemComponent} from "../eintrag-listelem/eintrag-listelem.component";
import {Eintrag} from "../Eintrag";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-eintraege-list',
  standalone: true,
  imports: [
    EintragListelemComponent,
    NgForOf
  ],
  templateUrl: './eintraege-list.component.html',
  styleUrl: './eintraege-list.component.css'
})
export class EintraegeListComponent {

  @Input() eintraege?: Eintrag[];

}
