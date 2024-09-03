import {Component, OnInit, signal} from '@angular/core';
import {Buchung} from "../Buchung";
import {NgIf} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
import {DataService} from "../data.service";
import {ConfirmDialogViewModel} from "../ConfirmDialogViewModel";
import {DialogService} from "../dialog.service";

@Component({
  selector: 'app-eintrag-details',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './eintrag-details.component.html',
  styleUrl: './eintrag-details.component.css'
})
export class EintragDetailsComponent implements OnInit {

  eintrag? = signal<Buchung | undefined>(undefined);

  constructor(private dialogService: DialogService, private router: Router, private route: ActivatedRoute, private dataService: DataService) {

  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const eintragId = +params.get('eintragId')!;
      this.eintrag?.set(this.dataService.getBuchungById(eintragId));
    });
  }

  onBackClicked() {
    this.router.navigate(['/']);
  }

  onDeleteButtonClicked() {
    const confirmDialogViewModel: ConfirmDialogViewModel = {
      title: 'Eintrag löschen?',
      message: 'Willst du den Eintrag wirklich löschen? Er kann nicht wieder hergestellt werden!',
      onConfirmClicked: () => {
        this.dialogService.isConfirmDialogVisible = false;
        this.dataService.deleteBuchung(this.eintrag!()!.id);
        this.router.navigate(['/'])
      },
      onCancelClicked: () => {
        this.dialogService.isConfirmDialogVisible = false;
      }
    };
    this.dialogService.showConfirmDialog(confirmDialogViewModel);
  }

  onEditClicked() {
    this.router.navigate(['/editEintrag', this.eintrag!()!.id]);
  }
}
