import {Component, Input, OnInit} from '@angular/core';
import {BuchungListelemComponent} from "../buchung-listelem/buchung-listelem.component";
import {NgForOf} from "@angular/common";
import {TimeFilterTopbarComponent} from "../../time-filter-topbar/time-filter-topbar.component";
import {DataService} from "../../data.service";
import {Buchung, Day} from "../../../ClassesInterfacesEnums";
import {BuchungenListDayComponent} from "../buchungen-list-day/buchungen-list-day.component";

@Component({
  selector: 'app-buchungen-list',
  standalone: true,
  imports: [
    BuchungListelemComponent,
    NgForOf,
    TimeFilterTopbarComponent,
    BuchungenListDayComponent
  ],
  templateUrl: './buchungen-list.component.html',
  styleUrl: './buchungen-list.component.css'
})
export class BuchungenListComponent implements OnInit{

  @Input() buchungen?: Buchung[];
  date = new Date();
  days: Day[] = [];

  constructor(private dataService: DataService){
    const months = this.dataService.userData.months;
    months.forEach(month => {
      month.weeks.forEach(week => {
        week.days.forEach(day => {
          if(day.buchungen!.length > 0){
            this.days.push(day);
          }
        })
      })
    });
    this.orderByDateDesc();
    console.log(this.days)
  }

  ngOnInit() {
    this.orderByDateDesc();
  }

  orderByDateDesc() {
    this.days?.sort((a, b) => b.date.getTime() - a.date.getTime())
  }

}
