import {Buchungen} from "./Buchungen";
import {Buchung, Day, Month, Week} from "./ClassesInterfacesEnums";
import {signal} from "@angular/core";

export class UserData {

  public buchungen: Buchungen = new Buchungen();
  public months= signal<Month[]>([]);

  constructor(buchungen?: Buchung[]) {
    if(buchungen){
      this.buchungen = new Buchungen(buchungen);
    }
  }
}
