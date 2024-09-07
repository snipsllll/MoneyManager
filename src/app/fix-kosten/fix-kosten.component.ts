import {Component, OnInit, signal} from '@angular/core';
import {TopBarComponent} from "../top-bar/top-bar.component";
import {TopbarService} from "../topbar.service";
import {NgForOf} from "@angular/common";
import {Data} from "@angular/router";
import {DataService} from "../data.service";
import {FixKostenEintragListelemComponent} from "../fix-kosten-eintrag-listelem/fix-kosten-eintrag-listelem.component";

@Component({
  selector: 'app-fix-kosten',
  standalone: true,
  imports: [
    TopBarComponent,
    NgForOf,
    FixKostenEintragListelemComponent
  ],
  templateUrl: './fix-kosten.component.html',
  styleUrl: './fix-kosten.component.css'
})
export class FixKostenComponent implements OnInit{

  selectedElement = signal<number>(-1);

  constructor(private topbarService: TopbarService, public dataService: DataService) {
  }

  ngOnInit() {
    this.topbarService.title.set('FIX KOSTEN');
    this.topbarService.dropDownSlidIn.set(false);
    this.topbarService.isDropDownDisabled = true;
  }

  onPlusClicked() {

  }

  onElementClicked(eintragId: number) {
    if(this.selectedElement() === eintragId){
      this.selectedElement.set(-1)
    } else {
      this.selectedElement.set(eintragId);
    }
  }

}
