import {Component, OnInit, signal} from '@angular/core';
import {NgIf} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
import {DataService} from "../data.service";
import {ConfirmDialogViewModel} from "../ConfirmDialogViewModel";
import {DialogService} from "../dialog.service";
import {Buchung} from "../../ClassesInterfacesEnums";
import {ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'app-buchung-details',
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './buchung-details.component.html',
  styleUrl: './buchung-details.component.css'
})
export class BuchungDetailsComponent implements OnInit {

  buchung? = signal<Buchung | undefined>(undefined);
  titelVorhanden = false;

  constructor(private dialogService: DialogService, private router: Router, private route: ActivatedRoute, private dataService: DataService) {

  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const buchungsId = +params.get('buchungsId')!;
      this.buchung?.set(this.dataService.getBuchungById(buchungsId));
      if(this.buchung!()?.title !== null && this.buchung!()?.title !== undefined && this.buchung!()?.title !== '') {
        this.titelVorhanden = true;
      }
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
        this.dataService.deleteBuchung(this.buchung!()!.id!);
        console.log(this.dataService.userData)
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
