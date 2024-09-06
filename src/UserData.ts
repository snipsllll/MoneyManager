import {Buchungen} from "./Buchungen";
import {Buchung, Day, Month, Week} from "./ClassesInterfacesEnums";

export class UserData {

  public buchungen: Buchungen = new Buchungen();
  public months: Month[] = [];

  constructor(buchungen?: Buchung[]) {
    if(buchungen){
      this.buchungen = new Buchungen(buchungen);
    }
  }
}
