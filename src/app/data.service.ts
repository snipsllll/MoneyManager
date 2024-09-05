import {Injectable} from '@angular/core';
import {UserData} from "../UserData";
import {FileEngine} from "../FileEngine";
import {Buchung} from "../ClassesInterfacesEnums";

@Injectable({
  providedIn: 'root'
})

export class DataService {

  userData: UserData;
  selectedTimeFilter = 'alle';
  testData: DB = DB.none;
  download: boolean = true;

  private _fileEngine = new FileEngine(this.testData, this.download);

  constructor() {
    this.userData = this._fileEngine.userData
  }

  public createNewBuchung(buchung: Buchung) {
    buchung.id = this.getNextFreeBuchungsId();
    this.createNewBuchungData(buchung);
    this.update();
  }

  public editBuchung(buchung: Buchung) {
    this.editBuchungData(buchung);
    this.update();
  }

  public deleteBuchung(buchungsId?: number) {
    if (buchungsId) {
      this.deleteBuchungData(buchungsId)
    }
    this.update();
  }

  public getAlleBuchungen() {
    return this.userData.buchungen.alleBuchungen;
  }

  public getBuchungById(buchungId: number): Buchung | undefined {
    return this.userData.buchungen.alleBuchungen.find(x => x.id === buchungId);
  }

  private getNextFreeBuchungsId() {
    let freeId = 1;
    for (let i = 0; i < this.userData.buchungen.alleBuchungen.length; i++) {
      if (this.userData.buchungen.alleBuchungen.find(x => x.id === freeId) === undefined) {
        return freeId;
      } else {
        freeId++;
      }
    }
    return freeId;
  }

  private createNewBuchungData(buchung: Buchung) {
    this.userData.buchungen.alleBuchungen.push(buchung);
    this.updateBuchungenInMonths();
  }

  private editBuchungData(buchung: Buchung){
    if (!buchung) {
      return;
    }
    const alleBuchungenBuchungIndex = this.userData.buchungen.alleBuchungen.findIndex(pBuchung => pBuchung.id === buchung.id);
    if (alleBuchungenBuchungIndex === -1) {
      return;
    }
    this.userData.buchungen.alleBuchungen[alleBuchungenBuchungIndex] = buchung;
    this.updateBuchungenInMonths();
  }

  private deleteBuchungData(buchungsId?: number) {
    if (!buchungsId) {
      return;
    }
    const alleBuchungenBuchungIndex = this.userData.buchungen.alleBuchungen.findIndex(pBuchung => pBuchung.id === buchungsId);
    if (alleBuchungenBuchungIndex === -1) {
      return;
    }
    this.userData.buchungen.alleBuchungen.splice(alleBuchungenBuchungIndex, 1);
    this.updateBuchungenInMonths();
  }

  private recalculateIstBudgets() {
    this.userData.months.forEach(month => {
      let monthAusgaben = 0;

      month.weeks.forEach(week => {
        let weekAusgaben = 0;

        week.days.forEach(day => {
          let dayAusgaben = 0;

          day.buchungen?.forEach(buchung => {
            dayAusgaben += buchung.betrag ?? 0;
          });

          // Calculate istBudget for the day
          day.istBudget = (day.budget ?? 0) - dayAusgaben;

          weekAusgaben += dayAusgaben; // Accumulate for the week
        });

        // Calculate istBudget for the week
        week.istBudget = (week.budget ?? 0) - weekAusgaben;

        monthAusgaben += weekAusgaben; // Accumulate for the month
      });

      // Calculate istBudget for the month
      month.istBudget = (month.budget ?? 0) - monthAusgaben;
    });
  }

  private update() {
    this.recalculateIstBudgets();
    this.updateBuchungenInMonths();
    this._fileEngine.save();
  }

  private updateBuchungenInMonths(){
    this.userData.months.forEach(month => {
      month.weeks.forEach(week => {
        week.days.forEach(day => {
          day.buchungen = [];
        })
      })
    })
    this.userData.buchungen.alleBuchungen.forEach(buchung => {
      const monthIndex = this.userData.months.findIndex(month => month.startDate.toLocaleDateString() === new Date(2024, buchung.date.getMonth()).toLocaleDateString());
      const weekIndex = this.userData.months[monthIndex].weeks.findIndex(week => {
        return week.days.find(day => day.date.toLocaleDateString() === buchung.date.toLocaleDateString());
      });
      const dayIndex = this.userData.months[monthIndex].weeks[weekIndex].days.findIndex(day => day.date.toLocaleDateString() === buchung.date.toLocaleDateString())
      this.userData.months[monthIndex].weeks[weekIndex].days[dayIndex].buchungen!.push(buchung);
    })
  }
}

enum DB {
  short,
  mid,
  long,
  none
}
