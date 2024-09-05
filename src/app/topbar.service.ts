import {Injectable, signal} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TopbarService {
  title = signal<string>('');
  isSidenavVisible = signal<boolean>(false);
  isSlidIn = signal<boolean>(false);

  constructor() { }
}
