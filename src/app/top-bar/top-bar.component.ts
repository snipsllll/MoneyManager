import {Component, computed, OnInit} from '@angular/core';
import {TopbarService} from "../topbar.service";
import {SideNavService} from "../side-nav.service";
import {NgIf} from "@angular/common";
import {SideNavComponent} from "../side-nav/side-nav.component";
import {DataService} from "../data.service";

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
  monthIstBudget = computed(() => {
    console.log(this.dataService.updated())
    return this.dataService.getDayIstBudgets(new Date())?.monthIstBudget;
  })

  constructor(private dataService: DataService, public topbarService: TopbarService, public sideNavService: SideNavService) {

  }

  ngOnInit() {
    this.title = this.topbarService.title();
  }

  onMenuButtonClicked() {
    this.topbarService.isSlidIn.set(!this.topbarService.isSlidIn());
  }

  toggleDropdown(){
    this.topbarService.dropDownSlidIn.set(!this.topbarService.dropDownSlidIn());
  }
}
