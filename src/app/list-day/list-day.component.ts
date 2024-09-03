import {Component, Input} from '@angular/core';
import {Buchung} from "../Buchung";

@Component({
  selector: 'app-list-day',
  standalone: true,
  imports: [],
  templateUrl: './list-day.component.html',
  styleUrl: './list-day.component.css'
})
export class ListDayComponent {

  @Input() date!: Date;

  @Input() buchungen?: Buchung[];

}
