import {Component, OnInit} from '@angular/core';
import {TopbarService} from "../topbar.service";
import {SideNavService} from "../side-nav.service";
import {NgIf} from "@angular/common";
import {SideNavComponent} from "../side-nav/side-nav.component";

@Component({
  selector: 'app-top-bar',
  standalone: true,
  imports: [
    NgIf,
    SideNavComponent
  ],
  templateUrl: './top-bar.component.html',
  styleUrl: './top-bar.component.css'
})
export class TopBarComponent implements OnInit{
  title?: string;

  constructor(public topbarService: TopbarService, public sideNavService: SideNavService) {
  }

  ngOnInit() {
    this.title = this.topbarService.title();
  }

  onMenuButtonClicked() {
    console.log(6724678234682376)
    this.topbarService.isSidenavVisible.set(!this.topbarService.isSidenavVisible());
  }
}
