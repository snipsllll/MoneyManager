import { Component } from '@angular/core';
import {EintraegeListComponent} from "../eintraege-list/eintraege-list.component";
import {Router} from "@angular/router";

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

  constructor(private router: Router) {
  }

  onPlusClicked() {
    this.router.navigate(['/createEintrag']);
  }

}
