import {Component, OnInit} from '@angular/core';
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

  constructor(public topbarService: TopbarService) {
  }

  ngOnInit() {
    this.topbarService.title.set('BUDGET');
  }
}
