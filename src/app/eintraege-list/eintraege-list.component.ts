import {Component, Input, OnInit} from '@angular/core';
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
export class EintraegeListComponent implements OnInit{

  @Input() eintraege?: Eintrag[];

  ngOnInit() {
    /*
    this.eintraege = [
      {
        id: 123,
        title: 'titel 1',
        betrag: 20,
        beschreibung: 'hallo',
        dateTime: new Date()
      },
      {
        id: 456,
        title: 'titel 2',
        betrag: -50.3,
        beschreibung: 'mist',
        dateTime: new Date()
      }
    ]*/
  }

}
