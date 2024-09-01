import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {ConfirmDialogComponent} from "./confirm-dialog/confirm-dialog.component";
import {DialogService} from "./dialog.service";
import {EintragDetailsComponent} from "./eintrag-details/eintrag-details.component";
import {DateTime, Eintrag} from "./Eintrag";
import {FormsModule} from "@angular/forms";
import {EditEintragComponent} from "./edit-eintrag/edit-eintrag.component";
import {CreateEintragComponent} from "./create-eintrag/create-eintrag.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HomeComponent, ConfirmDialogComponent, EintragDetailsComponent, FormsModule, EditEintragComponent, CreateEintragComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'MoneyManager';

  date = new Date();
  specificDateTime: DateTime;

  testEintrag: Eintrag = {
    id: 374329,
    title: '3x Green Minis',
    betrag: -17.70,
    date: this.date.toLocaleDateString('de-DE'), // Format: dd/mm/yyyy
    time: this.date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }), // Format: hh:mm
    beschreibung: '3x Green Minis á 5,90€'
  }

  constructor(public dialogService: DialogService) {
    this.specificDateTime = {
      date: '12.03.2020',
      time: '12:30'
    };
  }

  onDateChange(event: any) {
    const date = new Date(event.target.value);
    this.specificDateTime.date = date.toLocaleDateString('de-DE');
  }

  onTimeChange(event: any) {
    const [hours, minutes] = event.target.value.split(':');
    const date = new Date();
    date.setHours(+hours, +minutes);
    this.specificDateTime.time = date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
  }
}
