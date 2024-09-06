import {Component} from '@angular/core';
import {NgIf} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {DialogService} from "../dialog.service";
import {ConfirmDialogViewModel} from "../ConfirmDialogViewModel";
import {Router} from "@angular/router";
import {DataService} from "../data.service";
import {Buchung} from "../../ClassesInterfacesEnums";

@Component({
  selector: 'app-create-buchung',
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './create-buchung.component.html',
  styleUrl: './create-buchung.component.css'
})
export class CreateBuchungComponent {
  buchung!: Buchung;
  showBetragWarning = false;
  date?: string;

  constructor(private dataService: DataService, public dialogService: DialogService, private router: Router) {
    const date = new Date();

    this.buchung = {
      title: '',
      betrag: null,
      date: date,
      time: date.toLocaleTimeString('de-DE', {hour: '2-digit', minute: '2-digit'}),
      beschreibung: ''
    };
    this.date = this.buchung.date.toISOString().slice(0, 10);
  }

  onSaveClicked() {
    if (this.buchung.betrag !== 0 && this.buchung.betrag !== null) {
      this.dataService.createBuchung(this.buchung);
      this.router.navigate(['/']);
    } else {
      this.showBetragWarning = true;
    }
  }

  onCancelClicked() {
    if (this.isBuchungEmpty()) {
      this.router.navigate(['/']);
      return;
    }
    const confirmDialogViewModel: ConfirmDialogViewModel = {
      title: 'Cancel?',
      message: 'Do you really want to cancel? All changes will be lost!',
      onCancelClicked: () => {
        this.dialogService.isConfirmDialogVisible = false;
      },
      onConfirmClicked: () => {
        this.dialogService.isConfirmDialogVisible = false;
        this.router.navigate(['/']);
      }
    }
    this.dialogService.showConfirmDialog(confirmDialogViewModel);
  }

  onBackClicked() {
    if (this.isBuchungEmpty()) {
      this.router.navigate(['/']);
      return;
    }
    const confirmDialogViewModel: ConfirmDialogViewModel = {
      title: 'Cancel?',
      message: 'Do you really want to return to home? All changes will be lost!',
      onCancelClicked: () => {
        this.dialogService.isConfirmDialogVisible = false;
      },
      onConfirmClicked: () => {
        this.dialogService.isConfirmDialogVisible = false;
        this.router.navigate(['/']);
      }
    }
    this.dialogService.showConfirmDialog(confirmDialogViewModel);
  }

  onDateChange(event: any) {
    if(this.date)
      this.buchung!.date = new Date(this.date);
  }

  onTimeChange(event: any) {
    const [hours, minutes] = event.target.value.split(':');
    const date = new Date();
    date.setHours(+hours, +minutes);
    this.buchung!.time = date.toLocaleTimeString('de-DE', {hour: '2-digit', minute: '2-digit'});
  }

  private isBuchungEmpty() {
    return (this.buchung.betrag === 0 && this.buchung.title === '' && this.buchung.beschreibung === '')
  }
}
