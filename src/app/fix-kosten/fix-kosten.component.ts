import {Component, OnInit, signal} from '@angular/core';
import {TopBarComponent} from "../top-bar/top-bar.component";
import {TopbarService} from "../topbar.service";
import {NgForOf, NgIf} from "@angular/common";
import {DataService} from "../data.service";
import {FixKostenEintragListelemComponent} from "../fix-kosten-eintrag-listelem/fix-kosten-eintrag-listelem.component";
import {FixKostenEintrag} from "../../ClassesInterfacesEnums";
import {FormsModule} from "@angular/forms";
import {ConfirmDialogViewModel} from "../ConfirmDialogViewModel";
import {DialogService} from "../dialog.service";

@Component({
  selector: 'app-fix-kosten',
  standalone: true,
  imports: [
    TopBarComponent,
    NgForOf,
    FixKostenEintragListelemComponent,
    NgIf,
    FormsModule
  ],
  templateUrl: './fix-kosten.component.html',
  styleUrl: './fix-kosten.component.css'
})
export class FixKostenComponent implements OnInit{

  elements = signal<FixKostenEintrag[]>([]);
  selectedElement = signal<number>(-1);
  showCreateDialog = signal<boolean>(false);
  showBetragWarnung = signal<boolean>(false);
  newFixKostenEintrag!: FixKostenEintrag;

  constructor(private dialogService: DialogService, private topbarService: TopbarService, public dataService: DataService) {
  }

  ngOnInit() {
    this.topbarService.title.set('FIX KOSTEN');
    this.topbarService.dropDownSlidIn.set(false);
    this.topbarService.isDropDownDisabled = true;
    this.elements.set(this.dataService.userData.fixKosten);
    this.newFixKostenEintrag = {
      title: '',
      betrag: 0,
      beschreibung: ''
    }
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
    if(this.darfSpeichern()){
      this.showCreateDialog.set(false);
      this.dataService.addFixKostenEintrag(this.newFixKostenEintrag);
    } else {
      this.showBetragWarnung.set(true);
    }
  }

  onCreateAbbrechenClicked() {
    if (this.isEmpty()){
    this.showCreateDialog.set(false);
    return;
  }
    const dialogViewmodel: ConfirmDialogViewModel = {
      title: 'Abbrechen?',
      message: 'Willst du abbrechen? Alle Änderungen werden verworfen!',
      onConfirmClicked: () => {
        this.dialogService.isConfirmDialogVisible = false;
        this.showCreateDialog.set(false);
      },
      onCancelClicked: () => {
        this.dialogService.isConfirmDialogVisible = false;
      }
    }
    this.dialogService.showConfirmDialog(dialogViewmodel);
  }

  darfSpeichern() {
    return this.newFixKostenEintrag.betrag !== 0
  }

  isEmpty() {
    return this.newFixKostenEintrag.betrag === 0 && this.newFixKostenEintrag.title === '' && this.newFixKostenEintrag.beschreibung === ''
  }

}
