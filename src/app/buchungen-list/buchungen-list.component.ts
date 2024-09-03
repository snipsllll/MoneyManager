import {Component, Input} from '@angular/core';
import {BuchungListelemComponent} from "../buchung-listelem/buchung-listelem.component";
import {Buchung} from "../Buchung";
import {NgForOf} from "@angular/common";
import {TimeFilterTopbarComponent} from "../time-filter-topbar/time-filter-topbar.component";
import {DataService} from "../data.service";

@Component({
  selector: 'app-buchungen-list',
  standalone: true,
  imports: [
    BuchungListelemComponent,
    NgForOf,
    TimeFilterTopbarComponent
  ],
  templateUrl: './buchungen-list.component.html',
  styleUrl: './buchungen-list.component.css'
})
export class BuchungenListComponent {

  @Input() buchungen?: Buchung[];
  date = new Date();

  constructor(private dataService: DataService){}

  onHeuteClicked() {
    this.buchungen = this.dataService.getBuchungenByDay(this.date.toLocaleDateString('de-DE'));
  }

  OnWocheClicked(){
    this.buchungen = this.dataService.getBuchungenForCurrentWeek();
  }

  onMonatClicked() {
    this.buchungen = this.dataService.getBuchungenForThisMonth();
  }

  onAlleClicked() {
    this.buchungen = this.dataService.getAlleBuchungen();
  }

}
