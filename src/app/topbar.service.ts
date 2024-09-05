import {Injectable, signal} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TopbarService {
  title = signal<string>('');
  isSlidIn = signal<boolean>(false);

  constructor() { }
}
