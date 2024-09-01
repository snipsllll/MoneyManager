import {Component} from '@angular/core';
import {EintraegeListComponent} from "../eintraege-list/eintraege-list.component";
import {Router} from "@angular/router";
import {Eintrag} from "../Eintrag";
import {DataService} from "../data.service";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    EintraegeListComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  eintraege!: Eintrag[];

  constructor(private router: Router, private dataService: DataService) {
    this.eintraege = this.dataService.getEintreage();
  }

  onPlusClicked() {
    this.router.navigate(['/createEintrag']);
  }
}
