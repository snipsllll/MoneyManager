import {Component, computed, EventEmitter, Input, Output, signal, WritableSignal} from '@angular/core';
import {FixKostenEintrag} from "../../ClassesInterfacesEnums";
import {NgIf} from "@angular/common";
import {Data} from "@angular/router";
import {DataService} from "../data.service";
import {DialogService} from "../dialog.service";
import {ConfirmDialogViewModel} from "../ConfirmDialogViewModel";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'app-fix-kosten-eintrag-listelem',
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './fix-kosten-eintrag-listelem.component.html',
  styleUrl: './fix-kosten-eintrag-listelem.component.css'
})
export class FixKostenEintragListelemComponent {
  @Input() fixKostenEintrag!: FixKostenEintrag;
  @Input() selectedElementId!: WritableSignal<number>;

  isSelected = computed(() => {
    return this.selectedElementId() === this.fixKostenEintrag.id;
  })
  showMenu = signal<boolean>(false);
  showEditDialog = signal<boolean>(false);
  showBetragWarnung = signal<boolean>(false);

  @Output() onElementClicked = new EventEmitter();
  @Output() update = new EventEmitter();

  constructor(private dialogService: DialogService, private dataService: DataService) {
  }

  onMenuClicked() {
    this.showMenu.set(!this.showMenu());
  }

  onBearbeitenClicked() {
    this.showEditDialog.set(true);
    this.showMenu.set(false);
  }

  onLoeschenClicked() {
    const dialogViewModel: ConfirmDialogViewModel = {
      title: 'Fixkosten-Eintrag löschen?',
      message: 'Willst du diesen Fixkosten-Eintrag löschen? Er kann danach nicht wieder hergestellt werden!',
      onConfirmClicked: () => {
        this.dataService.deleteFixKostenEintrag(this.fixKostenEintrag.id!);
        this.update.emit();
        this.dialogService.isConfirmDialogVisible = false;
      },
      onCancelClicked: () => {
        this.dialogService.isConfirmDialogVisible = false;
        this.showMenu.set(false);
      }
    }
    this.dialogService.showConfirmDialog(dialogViewModel);

  }

  onEintragClicked() {
    this.onElementClicked.emit();
  }

  onEditSpeichernClicked() {
    this.showEditDialog.set(false);
  }

  onEditAbbrechenClicked() {
    this.showEditDialog.set(false);
  }
}
