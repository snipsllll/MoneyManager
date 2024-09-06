import {Component, OnInit, signal} from '@angular/core';
import {NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {DialogService} from "../dialog.service";
import {ConfirmDialogViewModel} from "../ConfirmDialogViewModel";
import {ActivatedRoute, Router} from "@angular/router";
import {DataService} from "../data.service";
import {Buchung, DayIstBudgets} from "../../ClassesInterfacesEnums";

@Component({
  selector: 'app-edit-buchung',
  standalone: true,
  imports: [
    NgIf,
    FormsModule
  ],
  templateUrl: './edit-buchung.component.html',
  styleUrl: './edit-buchung.component.css'
})
export class EditBuchungComponent implements OnInit {

  buchung = signal<Buchung | undefined>(undefined);
  oldBuchung?: Buchung;
  date?: string;
  dayBudget = signal<DayIstBudgets>({dayIstBudget: 0, weekIstBudget: 0, monthIstBudget: 0});
  showBetragWarning = false;

  constructor(private router: Router, private dataService: DataService, private route: ActivatedRoute, public dialogService: DialogService) {

  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const buchungsId = +params.get('buchungsId')!;
      this.buchung?.set(this.dataService.getBuchungById(buchungsId));
      this.oldBuchung = this.buchung();
      this.date = this.buchung()?.date.toISOString().slice(0, 10);
    })
    this.dayBudget.set(this.dataService.getDayIstBudgets(this.buchung()!.date)!);
  }

  onSaveClicked() {
    if (this.buchung()!.betrag !== 0 && this.buchung()!.betrag !== null) {
      if(this.dayBudget().dayIstBudget < this.buchung()!.betrag!) {
        const confirmDialogViewModel: ConfirmDialogViewModel = {
          title: 'Betrag ist zu hoch',
          message: `Der Betrag überschreitet dein Budget für ${this.buchung()!.date.toLocaleDateString() === new Date().toLocaleDateString() ? 'heute' : 'den ' + this.buchung()!.date.toLocaleDateString()}. Trotzdem fortfahren?`,
          onCancelClicked: () => {
            this.dialogService.isConfirmDialogVisible = false;
          },
          onConfirmClicked: () => {
            this.dataService.editBuchung(this.buchung()!);
            this.dialogService.isConfirmDialogVisible = false;
            this.router.navigate(['/']);
          }
        }
        this.dialogService.showConfirmDialog(confirmDialogViewModel);
      } else {
        this.dataService.editBuchung(this.buchung()!);
        this.router.navigate(['/']);
      }

    } else {
      this.showBetragWarning = true;
    }
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
        this.router.navigate(['/buchungDetails', this.buchung!()!.id]);
      }
    }
    this.dialogService.showConfirmDialog(confirmDialogViewModel);
  }

  onDateChange(event: any) {
    if(this.date)
    this.buchung()!.date = new Date(this.date);
    this.dayBudget.set(this.dataService.getDayIstBudgets(this.buchung()!.date)!);
  }

  onTimeChange(event: any) {
    const [hours, minutes] = event.target.value.split(':');
    const date = new Date();
    date.setHours(+hours, +minutes);
    this.buchung()!.time = date.toLocaleTimeString('de-DE', {hour: '2-digit', minute: '2-digit'});
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
        this.router.navigate(['/'])
      }
    }
    this.dialogService.showConfirmDialog(confirmDialogViewModel);
  }
}
