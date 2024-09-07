import { Injectable } from '@angular/core';
import {SideNavElements} from "../ClassesInterfacesEnums";

@Injectable({
  providedIn: 'root'
})
export class SideNavService{

  selectedElement = SideNavElements.home;

  constructor() { }
}
