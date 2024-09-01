import {Component, Input, signal} from '@angular/core';
import {Eintrag} from "../Eintrag";
import {NgIf} from "@angular/common";
import {DialogService} from "../dialog.service";
import {ConfirmDialogViewModel} from "../ConfirmDialogViewModel";
import {ActivatedRoute, Router} from "@angular/router";
import {DataService} from "../data.service";

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

  constructor(private route: ActivatedRoute, private dataService: DataService, private router: Router, private dialogService: DialogService){

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
        this.dataService.deleteEintrag(this.eintrag.id);
      },
      onCancelClicked: () => {
        this.dialogService.isConfirmDialogVisible = false;
      }
    };
    this.dialogService.showConfirmDialog(confirmDialogViewModel);
  }

}
