import {Component, computed, OnInit, signal} from '@angular/core';
import {TopBarComponent} from "../top-bar/top-bar.component";
import {TopbarService} from "../topbar.service";
import {DataService} from "../data.service";
import {FormsModule} from "@angular/forms";
import {BudgetInfosForMonth} from "../../ClassesInterfacesEnums";

@Component({
  selector: 'app-budget',
  standalone: true,
  imports: [
    TopBarComponent,
    FormsModule
  ],
  templateUrl: './budget.component.html',
  styleUrl: './budget.component.css'
})
export class BudgetComponent implements OnInit{

  selectedMonthIndex = signal<number>(new Date().getMonth());

  selectedYear = signal<number>(new Date().getFullYear());

  data = signal<BudgetInfosForMonth>({
    budget: 0,
    dayBudget: 0,
    istBudget: 0,
    totalBudget: 0,
    sparen: 0
  });

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

  constructor(public topbarService: TopbarService, private dataService: DataService) {
    this.update();
  }

  ngOnInit() {
    this.topbarService.title.set('BUDGET');
    this.update();
  }

  onMonthPrevClicked() {
    if(this.selectedMonthIndex() > 0
    ) {
      this.selectedMonthIndex.set(this.selectedMonthIndex() - 1)
    } else {
      this.selectedMonthIndex.set(11);
      this.selectedYear.set(this.selectedYear() - 1);
    }
    this.update();
  }

  onMonthNextClicked() {
    if(this.selectedMonthIndex() < 11
    ) {
      this.selectedMonthIndex.set(this.selectedMonthIndex() + 1)
    } else {
      this.selectedMonthIndex.set(0);
      this.selectedYear.set(this.selectedYear() + 1);
    }
    this.update();
  }

  onSparenChanged() {
    //this.dataService.changeSparenForMonth(this.getDateForSelectedMonth(), this.data().sparen);
    this.update();
  }

  onTotalBudgetChanged() {
    //this.dataService.changeTotalBudgetForMonth(this.getDateForSelectedMonth(), this.data().totalBudget);
    this.update();
  }

  private getDateForSelectedMonth() {
    return new Date(this.selectedYear(), this.selectedMonthIndex(), 1);
  }

  test() {
    console.log(this.data);
  }

  private update() {
    this.data.set(this.dataService.getBudgetInfosForMonth(this.getDateForSelectedMonth()) ?? {
      budget: 0,
      dayBudget: 0,
      istBudget: 0,
      totalBudget: 0,
      sparen: 0
    });
  }
}
