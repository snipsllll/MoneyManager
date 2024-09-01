import {Component, OnInit, signal} from '@angular/core';
import {NgIf} from "@angular/common";
import {Eintrag} from "../Eintrag";
import {FormsModule} from "@angular/forms";
import {DialogService} from "../dialog.service";
import {ConfirmDialogViewModel} from "../ConfirmDialogViewModel";
import {ActivatedRoute, Router} from "@angular/router";
import {DataService} from "../data.service";

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
export class EditEintragComponent implements OnInit {

  eintrag = signal<Eintrag | undefined>(undefined);
  oldEintrag?: Eintrag;

  constructor(private router: Router, private dataService: DataService, private route: ActivatedRoute, public dialogService: DialogService) {

  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const eintragId = +params.get('eintragId')!;
      this.eintrag?.set(this.dataService.getEintragById(eintragId));
      this.oldEintrag = this.eintrag();
    });
  }

  onSaveClicked() {
    this.dataService.editEintrag(this.eintrag!()!);
    this.router.navigate(['/home'])
  }

  onCancelClicked() {
    const confirmDialogViewModel: ConfirmDialogViewModel = {
      title: 'Cancel?',
      message: 'Do you really want to cancel editing? All changes will be lost!',
      onCancelClicked: () => {
        this.dialogService.isConfirmDialogVisible = false;
      },
      onConfirmClicked: () => {
        this.dialogService.isConfirmDialogVisible = false;
        this.router.navigate(['/eintragDetails', this.eintrag!()!.id]);
      }
    }
    this.dialogService.showConfirmDialog(confirmDialogViewModel);
  }

  onDateChange(event: any) {
    const date = new Date(event.target.value);
    this.eintrag()!.date = date.toLocaleDateString('de-DE');
  }

  onTimeChange(event: any) {
    const [hours, minutes] = event.target.value.split(':');
    const date = new Date();
    date.setHours(+hours, +minutes);
    this.eintrag()!.time = date.toLocaleTimeString('de-DE', {hour: '2-digit', minute: '2-digit'});
  }

  onBackClicked() {
    const confirmDialogViewModel: ConfirmDialogViewModel = {
      title: 'Cancel?',
      message: 'Do you really want to return home? All changes will be lost!',
      onCancelClicked: () => {
        this.dialogService.isConfirmDialogVisible = false;
      },
      onConfirmClicked: () => {
        this.dialogService.isConfirmDialogVisible = false;
        this.router.navigate(['/home'])
      }
    }
    this.dialogService.showConfirmDialog(confirmDialogViewModel);
  }
}
