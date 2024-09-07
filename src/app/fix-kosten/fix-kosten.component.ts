import {Component, OnInit, signal} from '@angular/core';
import {TopBarComponent} from "../top-bar/top-bar.component";
import {TopbarService} from "../topbar.service";
import {NgForOf, NgIf} from "@angular/common";
import {Data} from "@angular/router";
import {DataService} from "../data.service";
import {FixKostenEintragListelemComponent} from "../fix-kosten-eintrag-listelem/fix-kosten-eintrag-listelem.component";
import {FixKostenEintrag} from "../../ClassesInterfacesEnums";

@Component({
  selector: 'app-fix-kosten',
  standalone: true,
  imports: [
    TopBarComponent,
    NgForOf,
    FixKostenEintragListelemComponent,
    NgIf
  ],
  templateUrl: './fix-kosten.component.html',
  styleUrl: './fix-kosten.component.css'
})
export class FixKostenComponent implements OnInit{

  elements = signal<FixKostenEintrag[]>([]);
  selectedElement = signal<number>(-1);
  showCreateDialog = signal<boolean>(false);
  showBetragWarnung = signal<boolean>(false);

  constructor(private topbarService: TopbarService, public dataService: DataService) {
  }

  ngOnInit() {
    this.topbarService.title.set('FIX KOSTEN');
    this.topbarService.dropDownSlidIn.set(false);
    this.topbarService.isDropDownDisabled = true;
    this.elements.set(this.dataService.userData.fixKosten);
  }

  onPlusClicked() {
    this.showCreateDialog.set(true);
  }

  onElementClicked(eintragId: number) {
    if(this.selectedElement() === eintragId){
      this.selectedElement.set(-1)
    } else {
      this.selectedElement.set(eintragId);
    }
  }

  update() {
    this.elements.set(this.dataService.userData.fixKosten);
  }

  onCreateSpeichernClicked() {
    this.showCreateDialog.set(false);
  }

  onCreateAbbrechenClicked() {
    this.showCreateDialog.set(false);
  }

}
