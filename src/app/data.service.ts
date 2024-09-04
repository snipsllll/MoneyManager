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
  useTestData: boolean = false;
  download: boolean = true;

  private _fileEngine = new FileEngine(this.useTestData, this.download);

  constructor() {
    this.useTestData
      ? this.userData = this._fileEngine.userData
      : this.userData = this._fileEngine.userData
  }

  public createNewBuchung(buchung: Buchung) {
    this.createNewBuchungData(buchung);
    this.update();
  }

  public editBuchung(buchung: Buchung) {
    this.deleteBuchungData(buchung.id);
    this.createNewBuchungData(buchung);
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

  public getBuchungenByDay(date: Date) {
    return this.userData.buchungen.alleBuchungen.filter(x => x.date.toLocaleDateString() === date.toLocaleDateString());
  }

  public getBuchungenForCurrentWeek() {
    return this.filterThisWeek(this.userData.buchungen.alleBuchungen)
  }

  public getBuchungenForThisMonth() {
    return this.filterThisMonth(this.userData.buchungen.alleBuchungen);
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

  private getStartOfWeek(date: Date): Date {
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    startOfWeek.setDate(diff);
    startOfWeek.setHours(0, 0, 0, 0);
    return startOfWeek;
  }

  private getEndOfWeek(date: Date): Date {
    const endOfWeek = new Date(this.getStartOfWeek(date));
    endOfWeek.setDate(endOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);
    return endOfWeek;
  }

  private filterThisWeek(buchungen: Buchung[]): Buchung[] {
    const today = new Date();
    const startOfWeek = this.getStartOfWeek(today);
    const endOfWeek = this.getEndOfWeek(today);

    return buchungen.filter(buchung => {
      const buchungDate = buchung.date;
      return buchungDate !== null && buchungDate >= startOfWeek && buchungDate <= endOfWeek;
    });
  }

  private filterThisMonth(buchungen: Buchung[]): Buchung[] {
    const today = new Date();
    const startOfMonth = this.getStartOfMonth(today);
    const endOfMonth = this.getEndOfMonth(today);

    return buchungen.filter(buchung => {
      const buchungDate = buchung.date;
      return buchungDate !== null && buchungDate >= startOfMonth && buchungDate <= endOfMonth;
    });
  }

  private getStartOfMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0);
  }

  private getEndOfMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
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
    const buchungDate = this.userData.buchungen.alleBuchungen[alleBuchungenBuchungIndex].date;
    const monthIndex = this.userData.months.findIndex(month => month.startDate.toLocaleDateString() === new Date(buchungDate.getFullYear(), buchungDate.getMonth()).toLocaleDateString());
    const weekIndex = this.userData.months[monthIndex].weeks.findIndex(week => {
      return week.days.find(day => day.date.toLocaleDateString() === buchungDate.toLocaleDateString());
    });

    const dayIndex = this.userData.months[monthIndex].weeks[weekIndex].days.findIndex(day => day.date.toLocaleDateString() === buchungDate.toLocaleDateString())
    const buchungIndex = this.userData.months[monthIndex].weeks[weekIndex].days[dayIndex].buchungen?.findIndex(pBuchung => pBuchung.id === buchungsId) ?? -1;

    if (this.userData.months[monthIndex].weeks[weekIndex].days[dayIndex].buchungen !== undefined && buchungIndex !== -1) {
      this.userData.months[monthIndex].weeks[weekIndex].days[dayIndex].buchungen.splice(buchungIndex, 1);
    }
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

  private createNewBuchungData(buchung: Buchung) {
    this.userData.buchungen.alleBuchungen.push(buchung)
    let monthIndex = this.userData.months.findIndex(month => month.startDate.toLocaleDateString() === new Date(buchung.date.getFullYear(), buchung.date.getMonth()).toLocaleDateString());
    if (monthIndex === -1) {
      this.userData.generateNewMonth(buchung.date, this.userData.months[0].budget);
      monthIndex = this.userData.months.findIndex(month => month.startDate.toLocaleDateString() === new Date(buchung.date.getFullYear(), buchung.date.getMonth()).toLocaleDateString());
    }
    const weekIndex = this.userData.months[monthIndex].weeks.findIndex(week => {
      return week.days.find(day => day.date.toLocaleDateString() === buchung.date.toLocaleDateString());
    });

    const dayIndex = this.userData.months[monthIndex].weeks[weekIndex].days.findIndex(day => day.date.toLocaleDateString() === buchung.date.toLocaleDateString())

    buchung.id = this.getNextFreeBuchungsId();

    this.userData.months[monthIndex].weeks[weekIndex].days[dayIndex].buchungen?.push(buchung);
  }

  private update() {
    this.recalculateIstBudgets();
    this._fileEngine.save();
  }
}
