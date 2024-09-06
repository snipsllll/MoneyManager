import {Component, Input} from '@angular/core';
import {Day} from "../../../ClassesInterfacesEnums";
import {BuchungListelemComponent} from "../buchung-listelem/buchung-listelem.component";
import {NgForOf, NgIf} from "@angular/common";
import {last} from "rxjs";

@Component({
  selector: 'app-buchungen-list-day',
  standalone: true,
  imports: [
    BuchungListelemComponent,
    NgForOf,
    NgIf
  ],
  templateUrl: './buchungen-list-day.component.html',
  styleUrl: './buchungen-list-day.component.css'
})
export class BuchungenListDayComponent {

  @Input() day!: Day;

  protected readonly last = last;
}
