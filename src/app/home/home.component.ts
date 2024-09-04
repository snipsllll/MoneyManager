import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {DataService} from "../data.service";
import {BuchungenListComponent} from "./buchungen-list/buchungen-list.component";
import {Buchung} from "../../ClassesInterfacesEnums";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    BuchungenListComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  buchungen!: Buchung[];

  constructor(private router: Router, private dataService: DataService) {
    this.buchungen = this.dataService.getAlleBuchungen();
  }

  onPlusClicked() {
    this.router.navigate(['/createBuchung']);
  }
}
