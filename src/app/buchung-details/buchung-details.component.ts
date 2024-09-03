import {Component, OnInit, signal} from '@angular/core';
import {Buchung} from "../Buchung";
import {NgIf} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
import {DataService} from "../data.service";
import {ConfirmDialogViewModel} from "../ConfirmDialogViewModel";
import {DialogService} from "../dialog.service";

@Component({
  selector: 'app-buchung-details',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './buchung-details.component.html',
  styleUrl: './buchung-details.component.css'
})
export class BuchungDetailsComponent implements OnInit {

  buchung? = signal<Buchung | undefined>(undefined);

  constructor(private dialogService: DialogService, private router: Router, private route: ActivatedRoute, private dataService: DataService) {

  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const buchungsId = +params.get('buchungsId')!;
      this.buchung?.set(this.dataService.getBuchungById(buchungsId));
    });
  }

  onBackClicked() {
    this.router.navigate(['/']);
  }

  onDeleteButtonClicked() {
    const confirmDialogViewModel: ConfirmDialogViewModel = {
      title: 'Buchung löschen?',
      message: 'Willst du die Buchung wirklich löschen? Sie kann nicht wieder hergestellt werden!',
      onConfirmClicked: () => {
        this.dialogService.isConfirmDialogVisible = false;
        this.dataService.deleteBuchung(this.buchung!()!.id);
        this.router.navigate(['/'])
      },
      onCancelClicked: () => {
        this.dialogService.isConfirmDialogVisible = false;
      }
    };
    this.dialogService.showConfirmDialog(confirmDialogViewModel);
  }

  onEditClicked() {
    this.router.navigate(['/editBuchung', this.buchung!()!.id]);
  }
}
