import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {TopbarService} from "../topbar.service";

@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [],
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.css'
})
export class SideNavComponent {

  constructor(private router: Router, private topbarService: TopbarService) {
  }

  onHomeClicked(): void {
    this.router.navigate(['']);
    this.topbarService.isSidenavVisible.set(false);
  }

  onBudgetClicked(): void {
    this.router.navigate(['budget']);
    this.topbarService.isSidenavVisible.set(false);
  }

}
