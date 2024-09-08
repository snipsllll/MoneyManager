import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {TopbarService} from "../topbar.service";
import {SideNavElements} from "../../ClassesInterfacesEnums";
import {SideNavService} from "../side-nav.service";

@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [],
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.css'
})
export class SideNavComponent {

  constructor(private router: Router, public topbarService: TopbarService, public sideNavService: SideNavService) {

  }

  onHomeClicked(): void {
    this.router.navigate(['']);
    this.topbarService.isSlidIn.set(false);
    this.sideNavService.selectedElement = SideNavElements.home;
  }

  onBudgetClicked(): void {
    this.router.navigate(['budget']);
    this.topbarService.isSlidIn.set(false);
    this.sideNavService.selectedElement = SideNavElements.budget;
  }

  onFixKostenClicked(): void {
    this.router.navigate(['fixKosten']);
    this.topbarService.isSlidIn.set(false);
    this.sideNavService.selectedElement = SideNavElements.fixkosten;
  }

  protected readonly SideNavElements = SideNavElements;
}
