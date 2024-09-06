import {Component, computed, OnInit, signal} from '@angular/core';
import {TopBarComponent} from "../top-bar/top-bar.component";
import {TopbarService} from "../topbar.service";

@Component({
  selector: 'app-budget',
  standalone: true,
  imports: [
    TopBarComponent
  ],
  templateUrl: './budget.component.html',
  styleUrl: './budget.component.css'
})
export class BudgetComponent implements OnInit{

  selectedMonthIndex = signal<number>(new Date().getMonth());

  selectedMonth = computed(() =>{
    switch(this.selectedMonthIndex()){
      case 0:
        return 'Januar';
        break;
      case 1:
        return 'Februar';
        break;
      case 2:
        return 'März';
        break;
      case 3:
        return 'April';
        break;
      case 4:
        return 'Mai';
        break;
      case 5:
        return 'Juni';
        break;
      case 6:
        return 'Juli';
        break;
      case 7:
        return 'August';
        break;
      case 8:
        return 'September';
        break;
      case 9:
        return 'Oktober';
        break;
      case 10:
        return 'November';
        break;
      case 11:
        return 'Dezember';
        break;
    }
    return '';
  });

  constructor(public topbarService: TopbarService) {
  }

  ngOnInit() {
    this.topbarService.title.set('BUDGET');
  }

  onMonthPrevClicked() {
    this.selectedMonthIndex() > 0
      ? this.selectedMonthIndex.set(this.selectedMonthIndex() - 1)
      : this.selectedMonthIndex.set(11);
  }

  onMonthNextClicked() {
    this.selectedMonthIndex() < 11
      ? this.selectedMonthIndex.set(this.selectedMonthIndex() + 1)
      : this.selectedMonthIndex.set(0);
  }

  test() {
    console.log(this.selectedMonth())
  }
}
