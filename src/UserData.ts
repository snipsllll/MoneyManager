import {Buchungen} from "./Buchungen";
import {Buchung, Day, FixKostenEintrag, Month, Week} from "./ClassesInterfacesEnums";
import {signal} from "@angular/core";

export class UserData {

  public buchungen: Buchungen = new Buchungen();
  public months= signal<Month[]>([]);
  public fixKosten: FixKostenEintrag[] = [];

  constructor(buchungen?: Buchung[]) {
    if(buchungen){
      this.buchungen = new Buchungen(buchungen);
    }
  }
}
