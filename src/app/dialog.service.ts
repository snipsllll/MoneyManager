import {Injectable} from '@angular/core';
import {ConfirmDialogViewModel} from "./ConfirmDialogViewModel";

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  isConfirmDialogVisible = false;
  confirmDialogViewModel?: ConfirmDialogViewModel;

  constructor() {
  }

  showConfirmDialog(confirmDialogViewModel: ConfirmDialogViewModel) {
    this.isConfirmDialogVisible = true;
    this.confirmDialogViewModel = confirmDialogViewModel;
  }
}
