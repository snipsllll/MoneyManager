import {Component, Input} from '@angular/core';
import {EintragListelemComponent} from "../eintrag-listelem/eintrag-listelem.component";
import {Eintrag} from "../Eintrag";
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

  @Input() eintraege?: Eintrag[];
  date = new Date();

  constructor(private dataService: DataService){}

  onHeuteClicked() {
    this.eintraege = this.dataService.getEintraegeByDay(this.date.toLocaleDateString('de-DE'));
  }

  OnWocheClicked(){
    this.eintraege = this.dataService.getEintraegeByWeek();
  }

  onMonatClicked() {
    this.eintraege = this.dataService.getEintraegeByMonth();
  }

  onAlleClicked() {
    this.eintraege = this.dataService.getEintreage();
  }

}
