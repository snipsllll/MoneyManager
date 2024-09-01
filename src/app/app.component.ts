import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {ConfirmDialogComponent} from "./confirm-dialog/confirm-dialog.component";
import {DialogService} from "./dialog.service";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HomeComponent, ConfirmDialogComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'MoneyManager';

  constructor(public dialogService: DialogService) {
  }
}
