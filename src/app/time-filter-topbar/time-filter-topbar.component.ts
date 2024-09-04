import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {NgClass} from "@angular/common";
import {DataService} from "../data.service";

@Component({
  selector: 'app-time-filter-topbar',
  standalone: true,
  imports: [
    NgClass
  ],
  templateUrl: './time-filter-topbar.component.html',
  styleUrl: './time-filter-topbar.component.css'
})
export class TimeFilterTopbarComponent implements OnInit{

  activeClass = 'alle';

  @Output() onHeuteClickedEvnt = new EventEmitter();

  @Output() onWocheClickedEvnt = new EventEmitter();

  @Output() onMonatClickedEvnt = new EventEmitter();

  @Output() onAlleClickedEvnt = new EventEmitter();

  constructor(private dataService: DataService) {
  }

  ngOnInit() {
    this.activeClass = this.dataService.selectedTimeFilter;
    switch(this.activeClass) {
      case 'alle':
        this.onAlleClickedEvnt.emit();
        break;
      case 'heute':
        this.onHeuteClickedEvnt.emit();
        break;
      case 'woche':
        this.onWocheClickedEvnt.emit();
        break;
      case 'monat':
        this.onMonatClickedEvnt.emit();
        break;
    }
  }

  onHeuteClicked(){
    if(this.activeClass === 'heute'){
      this.onAlleClicked();
      return;
    }
    this.activeClass = 'heute';
    this.dataService.selectedTimeFilter = this.activeClass;
    this.onHeuteClickedEvnt.emit()
  }

  onWocheClicked(){
    if(this.activeClass === 'woche'){
      this.onAlleClicked();
      return;
    }
    this.activeClass = 'woche';
    this.dataService.selectedTimeFilter = this.activeClass;
    this.onWocheClickedEvnt.emit()
  }

  onMonatClicked(){
    if(this.activeClass === 'monat'){
      this.onAlleClicked();
      return;
    }
    this.activeClass = 'monat';
    this.dataService.selectedTimeFilter = this.activeClass;
    this.onMonatClickedEvnt.emit()
  }

  onAlleClicked() {
    this.activeClass = 'alle';
    this.dataService.selectedTimeFilter = this.activeClass;
    this.onAlleClickedEvnt.emit()
  }

}
