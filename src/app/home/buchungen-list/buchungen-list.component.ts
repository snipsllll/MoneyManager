import {Component, OnInit} from '@angular/core';
import {BuchungListelemComponent} from "../buchung-listelem/buchung-listelem.component";
import {NgForOf} from "@angular/common";
import {DataService} from "../../data.service";
import {Day} from "../../../ClassesInterfacesEnums";
import {BuchungenListDayComponent} from "../buchungen-list-day/buchungen-list-day.component";

@Component({
  selector: 'app-buchungen-list',
  standalone: true,
  imports: [
    BuchungListelemComponent,
    NgForOf,
    BuchungenListDayComponent
  ],
  templateUrl: './buchungen-list.component.html',
  styleUrl: './buchungen-list.component.css'
})
export class BuchungenListComponent implements OnInit{

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
  }

  ngOnInit() {
    this.orderByDateDesc();
  }

  orderByDateDesc() {
    this.days?.sort((a, b) => b.date.getTime() - a.date.getTime())
  }

}
