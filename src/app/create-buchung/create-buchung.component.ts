import {Component, signal} from '@angular/core';
import {NgIf} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {DialogService} from "../dialog.service";
import {ConfirmDialogViewModel} from "../ConfirmDialogViewModel";
import {Router} from "@angular/router";
import {DataService} from "../data.service";
import {Buchung, DayIstBudgets} from "../../ClassesInterfacesEnums";

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
  oldBuchung!: Buchung;
  showBetragWarning = false;
  date?: string;
  dayBudget = signal<DayIstBudgets>({dayIstBudget: 0, weekIstBudget: 0, monthIstBudget: 0});

  constructor(private dataService: DataService, public dialogService: DialogService, private router: Router) {
    const date = new Date();

    this.buchung = {
      title: '',
      betrag: null,
      date: date,
      time: date.toLocaleTimeString('de-DE', {hour: '2-digit', minute: '2-digit'}),
      beschreibung: ''
    };
    this.oldBuchung = {
      title: '',
      betrag: null,
      date: new Date(this.buchung.date),
      time: this.buchung.time,
      beschreibung: ''
    };
    this.dayBudget.set(this.dataService.getDayIstBudgets(date)!);
    this.date = this.buchung.date.toISOString().slice(0, 10);
  }

  onSaveClicked() {
    if (this.buchung.betrag !== 0 && this.buchung.betrag !== null) {
      if(this.dayBudget().dayIstBudget !== undefined && this.dayBudget().dayIstBudget! < this.buchung.betrag) {
        const confirmDialogViewModel: ConfirmDialogViewModel = {
          title: 'Betrag ist zu hoch',
          message: `Der Betrag überschreitet dein Budget für ${this.buchung!.date.toLocaleDateString() === new Date().toLocaleDateString() ? 'heute' : 'den ' + this.buchung!.date.toLocaleDateString()}. Trotzdem fortfahren?`,
          onCancelClicked: () => {
            this.dialogService.isConfirmDialogVisible = false;
          },
          onConfirmClicked: () => {
            this.dataService.createBuchung(this.buchung);
            this.dataService.update();
            this.dialogService.isConfirmDialogVisible = false;
            this.router.navigate(['/']);
          }
        }
        this.dialogService.showConfirmDialog(confirmDialogViewModel);
      } else {
        this.dataService.createBuchung(this.buchung);
        this.dataService.update();
        this.router.navigate(['/']);
      }

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
      title: 'Abbrechen?',
      message: 'Willst du verlassen? Alle Änderungen werden verworfen.',
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

  onDateChange() {
    if(this.date)
      this.buchung!.date = new Date(this.date);

    this.dayBudget.set(this.dataService.getDayIstBudgets(this.buchung.date) ?? {monthIstBudget: undefined, dayIstBudget: undefined, weekIstBudget: undefined});
  }

  onTimeChange(event: any) {
    const [hours, minutes] = event.target.value.split(':');
    const date = new Date();
    date.setHours(+hours, +minutes);
    this.buchung!.time = date.toLocaleTimeString('de-DE', {hour: '2-digit', minute: '2-digit'});
  }

  onBetragChanged() {
    this.buchung.betrag = +(this.buchung.betrag!.toFixed(2));
    console.log(this.buchung)
    console.log(this.oldBuchung)
  }

  private isBuchungEmpty() {
    return ((this.buchung.betrag === null || this.buchung.betrag === 0) && this.buchung.title === '' && this.buchung.beschreibung === '' && this.buchung.date.getDate() === this.oldBuchung.date.getDate() && this.buchung.time === this.oldBuchung.time)
  }
}
