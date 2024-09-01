import {Component, Input} from '@angular/core';
import {Eintrag} from "../Eintrag";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-eintrag-details',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './eintrag-details.component.html',
  styleUrl: './eintrag-details.component.css'
})
export class EintragDetailsComponent {

  @Input() eintrag?: Eintrag;

}
