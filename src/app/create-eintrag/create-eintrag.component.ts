import {Component, Input} from '@angular/core';
import {NgIf} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {Eintrag} from "../Eintrag";
import {DialogService} from "../dialog.service";
import {ConfirmDialogViewModel} from "../ConfirmDialogViewModel";

@Component({
  selector: 'app-create-eintrag',
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './create-eintrag.component.html',
  styleUrl: './create-eintrag.component.css'
})
export class CreateEintragComponent {
  eintrag!: Eintrag;

  constructor(public dialogService: DialogService) {
    const date = new Date();

    this.eintrag = {
      id: 123,
      title: '',
      betrag: 0,
      time: date.toLocaleDateString('de-DE'),
      date: date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }),
      beschreibung: ''
    };
  }

  onSaveClicked() {
    console.log(this.eintrag);
  }

  onCancelClicked() {
    const confirmDialogViewModel: ConfirmDialogViewModel = {
      title: 'Cancel?',
      message: 'Do you really want to cancel? All changes will be lost!',
      onCancelClicked: () => {
        this.dialogService.isConfirmDialogVisible = false;
      },
      onConfirmClicked: () => {
        this.dialogService.isConfirmDialogVisible = false;
        console.log(this.eintrag)
      }
    }
    this.dialogService.showConfirmDialog(confirmDialogViewModel);
  }

  onDateChange(event: any) {
    const date = new Date(event.target.value);
    this.eintrag!.date = date.toLocaleDateString('de-DE');
  }

  onTimeChange(event: any) {
    const [hours, minutes] = event.target.value.split(':');
    const date = new Date();
    date.setHours(+hours, +minutes);
    this.eintrag!.time = date.toLocaleTimeString('de-DE', {hour: '2-digit', minute: '2-digit'});
  }
}
