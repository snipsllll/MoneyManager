import {Component, OnInit} from '@angular/core';
import {ConfirmDialogViewModel} from "../ConfirmDialogViewModel";
import {DialogService} from "../dialog.service";

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.css'
})
export class ConfirmDialogComponent implements OnInit {

  viewModel?: ConfirmDialogViewModel;

  constructor(private dialogService: DialogService){

  }

  ngOnInit() {
    this.viewModel = this.dialogService.confirmDialogViewModel;
  }

  onConfirmButtonClicked() {
    this.viewModel?.onConfirmClicked();
  }

  onCanceluttonClicked() {
    this.viewModel?.onCancelClicked();
  }

}
