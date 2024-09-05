import {Component, EventEmitter, Input, Output, signal} from '@angular/core';
import {NgIf} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
import {ConfirmDialogViewModel} from "../../ConfirmDialogViewModel";
import {DataService} from "../../data.service";
import {DialogService} from "../../dialog.service";
import {Buchung} from "../../../ClassesInterfacesEnums";

@Component({
  selector: 'app-buchung-listelem',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './buchung-listelem.component.html',
  styleUrl: './buchung-listelem.component.css'
})
export class BuchungListelemComponent {

  @Input() buchung!: Buchung;
  showMenu = signal<boolean>(false);

  constructor(private route: ActivatedRoute, private dataService: DataService, private router: Router, private dialogService: DialogService) {

  }

  onMenuButtonClicked() {
    this.showMenu.set(!this.showMenu())
  }

  onBuchungClicked(buchungsId: number) {
    this.router.navigate(['/buchungDetails', buchungsId]);
  }

  onEditButtonClicked(buchungsId: number) {
    this.router.navigate(['/editBuchung', buchungsId]);
  }

  onDeleteButtonClicked() {
    this.showMenu.set(false);
    const confirmDialogViewModel: ConfirmDialogViewModel = {
      title: 'Buchung löschen?',
      message: 'Willst du die Buchung wirklich löschen? Sie kann nicht wieder hergestellt werden!',
      onConfirmClicked: () => {
        this.dialogService.isConfirmDialogVisible = false;
        this.dataService.deleteBuchung(this.buchung.id);
      },
      onCancelClicked: () => {
        this.dialogService.isConfirmDialogVisible = false;
      }
    };
    this.dialogService.showConfirmDialog(confirmDialogViewModel);
  }
}
