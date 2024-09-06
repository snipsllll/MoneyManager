import {Component, EventEmitter, Input, OnInit, Output, signal} from '@angular/core';
import {NgIf} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
import {ConfirmDialogViewModel} from "../../ConfirmDialogViewModel";
import {DataService} from "../../data.service";
import {DialogService} from "../../dialog.service";
import {Buchung} from "../../../ClassesInterfacesEnums";
import {TopbarService} from "../../topbar.service";

@Component({
  selector: 'app-buchung-listelem',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './buchung-listelem.component.html',
  styleUrl: './buchung-listelem.component.css'
})
export class BuchungListelemComponent implements OnInit{

  @Input() buchung!: Buchung;
  showMenu = signal<boolean>(false);

  constructor(public topbarService: TopbarService, private route: ActivatedRoute, private dataService: DataService, private router: Router, private dialogService: DialogService) {

  }

  ngOnInit() {
    this.topbarService.isDropDownDisabled = false;
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
        this.dataService.deleteBuchung(this.buchung.id!);
        this.dataService.update();
      },
      onCancelClicked: () => {
        this.dialogService.isConfirmDialogVisible = false;
      }
    };
    this.dialogService.showConfirmDialog(confirmDialogViewModel);
  }
}
