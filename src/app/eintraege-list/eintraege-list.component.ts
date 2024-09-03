import {Component, Input} from '@angular/core';
import {EintragListelemComponent} from "../eintrag-listelem/eintrag-listelem.component";
import {Buchung} from "../Buchung";
import {NgForOf} from "@angular/common";
import {TimeFilterTopbarComponent} from "../time-filter-topbar/time-filter-topbar.component";
import {DataService} from "../data.service";

@Component({
  selector: 'app-eintraege-list',
  standalone: true,
  imports: [
    EintragListelemComponent,
    NgForOf,
    TimeFilterTopbarComponent
  ],
  templateUrl: './eintraege-list.component.html',
  styleUrl: './eintraege-list.component.css'
})
export class EintraegeListComponent {

  @Input() eintraege?: Buchung[];
  date = new Date();

  constructor(private dataService: DataService){}

  onHeuteClicked() {
    this.eintraege = this.dataService.getBuchungenByDay(this.date.toLocaleDateString('de-DE'));
  }

  OnWocheClicked(){
    this.eintraege = this.dataService.getBuchungenForCurrentWeek();
  }

  onMonatClicked() {
    this.eintraege = this.dataService.getBuchungenForThisMonth();
  }

  onAlleClicked() {
    this.eintraege = this.dataService.getAlleBuchungen();
  }

}
