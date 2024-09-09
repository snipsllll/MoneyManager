import {Component, computed, OnInit} from '@angular/core';
import {TopbarService} from "../topbar.service";
import {SideNavService} from "../side-nav.service";
import {NgIf} from "@angular/common";
import {SideNavComponent} from "../side-nav/side-nav.component";
import {DataService} from "../data.service";
import {DayIstBudgetViewModel} from "../DayIstBudgetViewModel";

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
    this.dataService.updated();
    const x = this.dataService.getDayIstBudgets(new Date());
    const y: DayIstBudgetViewModel = {
      month: x?.monthIstBudget?.toString() ?? '???',
      week: x?.weekIstBudget?.toString() ?? '???',
      day: x?.dayIstBudget?.toString() ?? '???',
    };
    return y;
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
    if(!this.topbarService.isDropDownDisabled)
    this.topbarService.dropDownSlidIn.set(!this.topbarService.dropDownSlidIn());
  }

  test() {
    console.log(this.dataService.userData)
  }
}
