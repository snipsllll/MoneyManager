import {Component, Input} from '@angular/core';
import {NgIf} from "@angular/common";
import {Eintrag} from "../Eintrag";
import {FormsModule} from "@angular/forms";
import {DialogService} from "../dialog.service";
import {ConfirmDialogViewModel} from "../ConfirmDialogViewModel";

@Component({
  selector: 'app-edit-eintrag',
  standalone: true,
  imports: [
    NgIf,
    FormsModule
  ],
  templateUrl: './edit-eintrag.component.html',
  styleUrl: './edit-eintrag.component.css'
})
export class EditEintragComponent {

  @Input() eintrag?: Eintrag;
  oldEintrag?: Eintrag;

  constructor(public dialogService: DialogService) {
    this.oldEintrag = this.eintrag;
  }

  onSaveClicked() {
    console.log(this.eintrag);
  }

  onCancelClicked() {
    if(this.oldEintrag != this.eintrag){
      const confirmDialogViewModel: ConfirmDialogViewModel = {
        title: 'Cancel?',
        message: 'Do you really want to cancel editing? All changes will be lost!',
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
  }

  onDateChange(event: any) {
    const date = new Date(event.target.value);
    this.eintrag!.date = date.toLocaleDateString('de-DE');
  }

  onTimeChange(event: any) {
    const [hours, minutes] = event.target.value.split(':');
    const date = new Date();
    date.setHours(+hours, +minutes);
    this.eintrag!.time = date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
  }

}
