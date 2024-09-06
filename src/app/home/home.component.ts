import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {DataService} from "../data.service";
import {BuchungenListComponent} from "./buchungen-list/buchungen-list.component";
import {Buchung} from "../../ClassesInterfacesEnums";
import {TopBarComponent} from "../top-bar/top-bar.component";
import {TopbarService} from "../topbar.service";

@Component({
  selector: 'app-home',
  standalone: true,
    imports: [
        BuchungenListComponent,
        TopBarComponent
    ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{

  constructor(private router: Router, private dataService: DataService, private topbarService: TopbarService) {

  }

  ngOnInit() {
    this.topbarService.title.set('HOME');
  }

  onPlusClicked() {
    this.router.navigate(['/createBuchung']);
  }
}
