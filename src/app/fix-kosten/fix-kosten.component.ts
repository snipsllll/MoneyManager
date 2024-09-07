import {Component, OnInit} from '@angular/core';
import {TopBarComponent} from "../top-bar/top-bar.component";
import {TopbarService} from "../topbar.service";
import {NgForOf} from "@angular/common";
import {Data} from "@angular/router";
import {DataService} from "../data.service";

@Component({
  selector: 'app-fix-kosten',
  standalone: true,
  imports: [
    TopBarComponent,
    NgForOf
  ],
  templateUrl: './fix-kosten.component.html',
  styleUrl: './fix-kosten.component.css'
})
export class FixKostenComponent implements OnInit{

  constructor(private topbarService: TopbarService, public dataService: DataService) {
  }

  ngOnInit() {
    this.topbarService.title.set('FIX KOSTEN');
    this.topbarService.dropDownSlidIn.set(false);
    this.topbarService.isDropDownDisabled = true;
  }

  onPlusClicked() {

  }

}
