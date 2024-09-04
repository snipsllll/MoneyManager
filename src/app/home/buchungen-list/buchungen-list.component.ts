import {Component, Input, OnInit} from '@angular/core';
import {BuchungListelemComponent} from "../buchung-listelem/buchung-listelem.component";
import {NgForOf} from "@angular/common";
import {TimeFilterTopbarComponent} from "../../time-filter-topbar/time-filter-topbar.component";
import {DataService} from "../../data.service";
import {Buchung} from "../../../ClassesInterfacesEnums";

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
export class BuchungenListComponent implements OnInit{

  @Input() buchungen?: Buchung[];
  date = new Date();

  constructor(private dataService: DataService){
    this.orderByDateDesc();
  }

  ngOnInit() {
    this.orderByDateDesc();
  }

  orderByDateDesc() {
    this.buchungen?.sort((a, b) => b.date.getTime() - a.date.getTime())
  }

  onHeuteClicked() {
    this.buchungen = this.dataService.getBuchungenByDay(this.date);
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
