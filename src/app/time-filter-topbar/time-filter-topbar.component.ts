import {Component, EventEmitter, Output} from '@angular/core';
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-time-filter-topbar',
  standalone: true,
  imports: [
    NgClass
  ],
  templateUrl: './time-filter-topbar.component.html',
  styleUrl: './time-filter-topbar.component.css'
})
export class TimeFilterTopbarComponent {

  activeClass = 'alle';

  @Output() onHeuteClickedEvnt = new EventEmitter();

  @Output() onWocheClickedEvnt = new EventEmitter();

  @Output() onMonatClickedEvnt = new EventEmitter();

  @Output() onAlleClickedEvnt = new EventEmitter();

  onHeuteClicked(){
    this.activeClass = 'heute';
    this.onHeuteClickedEvnt.emit()
  }

  onWocheClicked(){
    this.activeClass = 'woche';
    this.onWocheClickedEvnt.emit()
  }

  onMonatClicked(){
    this.activeClass = 'monat';
    this.onMonatClickedEvnt.emit()
  }

  onAlleClicked() {
    this.activeClass = 'alle';
    this.onAlleClickedEvnt.emit()
  }

}
