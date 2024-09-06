import {Component, EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'app-mm-button',
  standalone: true,
  imports: [],
  templateUrl: './mm-button.component.html',
  styleUrl: './mm-button.component.css'
})
export class MmButtonComponent {

  @Output() onButtonClick = new EventEmitter();

}
