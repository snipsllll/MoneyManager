import {Component, OnInit} from '@angular/core';
import {Router, RouterModule, RouterOutlet} from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {ConfirmDialogComponent} from "./confirm-dialog/confirm-dialog.component";
import {DialogService} from "./dialog.service";
import {BuchungDetailsComponent} from "./buchung-details/buchung-details.component";
import {FormsModule} from "@angular/forms";
import {EditBuchungComponent} from "./edit-buchung/edit-buchung.component";
import {CreateBuchungComponent} from "./create-buchung/create-buchung.component";
import {TopBarComponent} from "./top-bar/top-bar.component";
import {MmButtonComponent} from "./mm-button/mm-button.component";
import {DataService} from "./data.service";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, RouterOutlet, HomeComponent, ConfirmDialogComponent, BuchungDetailsComponent, FormsModule, EditBuchungComponent, CreateBuchungComponent, TopBarComponent, MmButtonComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'MoneyManager';

  constructor(private dataService: DataService, private router: Router, public dialogService: DialogService) {
  }

  ngOnInit() {
    this.router.navigate(['/'])
  }
}
