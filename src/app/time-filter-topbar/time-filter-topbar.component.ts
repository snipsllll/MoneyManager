import {Component, EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'app-time-filter-topbar',
  standalone: true,
  imports: [],
  templateUrl: './time-filter-topbar.component.html',
  styleUrl: './time-filter-topbar.component.css'
})
export class TimeFilterTopbarComponent {

  @Output() onHeuteClicked = new EventEmitter();

  @Output() onWocheClicked = new EventEmitter();

  @Output() onMonatClicked = new EventEmitter();

  @Output() onAlleClicked = new EventEmitter();

}
