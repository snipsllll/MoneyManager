import {Component, Input, signal} from '@angular/core';
import {Eintrag} from "../Eintrag";
import {NgIf} from "@angular/common";
import {DialogService} from "../dialog.service";
import {ConfirmDialogViewModel} from "../ConfirmDialogViewModel";
import {Router} from "@angular/router";

@Component({
  selector: 'app-eintrag-listelem',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './eintrag-listelem.component.html',
  styleUrl: './eintrag-listelem.component.css'
})
export class EintragListelemComponent {

  @Input() eintrag!: Eintrag;
  showMenu = signal<boolean>(false);

  constructor(private router: Router, private dialogService: DialogService){

  }

  onMenuButtonClicked() {
    this.showMenu.set(!this.showMenu())
  }

  onEintragClicked(eintragId: number) {
    this.router.navigate(['/eintragDetails', eintragId]);
  }

  onEditButtonClicked(eintragId: number) {
    this.router.navigate(['/editEintrag', eintragId]);
  }

  onDeleteButtonClicked() {
    this.showMenu.set(false);
    const confirmDialogViewModel: ConfirmDialogViewModel = {
      title: 'Eintrag löschen?',
      message: 'Willst du den Eintrag wirklich löschen? Er kann nicht wieder hergestellt werden!',
      onConfirmClicked: () => {
        this.dialogService.isConfirmDialogVisible = false;
        console.log(1);
      },
      onCancelClicked: () => {
        this.dialogService.isConfirmDialogVisible = false;
        console.log(0);
      }
    };
    this.dialogService.showConfirmDialog(confirmDialogViewModel);
  }

}
