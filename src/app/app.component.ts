import {Component} from '@angular/core';
import {RouterModule, RouterOutlet} from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {ConfirmDialogComponent} from "./confirm-dialog/confirm-dialog.component";
import {DialogService} from "./dialog.service";
import {EintragDetailsComponent} from "./eintrag-details/eintrag-details.component";
import {FormsModule} from "@angular/forms";
import {EditEintragComponent} from "./edit-eintrag/edit-eintrag.component";
import {CreateEintragComponent} from "./create-eintrag/create-eintrag.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, RouterOutlet, HomeComponent, ConfirmDialogComponent, EintragDetailsComponent, FormsModule, EditEintragComponent, CreateEintragComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'MoneyManager';

  constructor(public dialogService: DialogService) {
  }
}
