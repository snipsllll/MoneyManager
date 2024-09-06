import {Injectable} from '@angular/core';
import {UserData} from "../UserData";
import {FileEngine} from "../FileEngine";
import {Buchung, BudgetInfosForMonth, Day, DayIstBudgets, SavedData, Week} from "../ClassesInterfacesEnums";

@Injectable({
  providedIn: 'root'
})

export class DataService {

  userData!: UserData;
  testData: DB = DB.none;
  download: boolean = true;

  private _fileEngine = new FileEngine(this.testData, this.download);

  constructor() {
    this.initializeUserData();
  }

  recalcIstBudgetsForMonth(date: Date){
    const month = this.userData.months()[this.getIndexOfMonth(date)];
    let monthAusgaben = 0;

    month.weeks?.forEach(week => {
      let weekAusgaben = 0;
      week.days.forEach(day => {
        let dayAusgaben = 0;
        day.buchungen?.forEach(buchung => {
          dayAusgaben += buchung.betrag ?? 0;
        });
        day.istBudget = (day.budget ?? 0) - dayAusgaben;
        weekAusgaben += dayAusgaben;
      });
      week.istBudget = (week.budget ?? 0) - weekAusgaben;
      monthAusgaben += weekAusgaben;
    });
    month.istBudget = (month.budget ?? 0) - monthAusgaben;

    this.userData.months()[this.getIndexOfMonth(date)] = month;
  }

  recalcAllIstBudgets(){
    this.userData.months().forEach(month => {
      let monthAusgaben = 0;

      month.weeks?.forEach(week => {
        let weekAusgaben = 0;
        week.days.forEach(day => {
          let dayAusgaben = 0;
          day.buchungen?.forEach(buchung => {
            dayAusgaben += buchung.betrag ?? 0;
          });
          day.istBudget = (day.budget ?? 0) - dayAusgaben;
          weekAusgaben += dayAusgaben;
        });
        week.istBudget = (week.budget ?? 0) - weekAusgaben;
        monthAusgaben += weekAusgaben;
      });
      month.istBudget = (month.budget ?? 0) - monthAusgaben;
    })
  }

  recalcBudgetsForMonth(date: Date){
    const month = this.userData.months()[this.getIndexOfMonth(date)];
    month.budget = month.totalBudget - month.sparen;
    month.dailyBudget = +(month.budget / (month.daysInMonth ?? 0)).toFixed(2);
    month.weeks?.forEach(week => {
      week.days.forEach(day => {
        day.budget = month.dailyBudget;
      });
      week.budget = week.daysInWeek * (month.dailyBudget ?? 0);
    });
    this.userData.months()[this.getIndexOfMonth(date)] = month;
  }

  recalcAllBudgets(){
    this.userData.months().forEach(month => {
      month.budget = month.totalBudget - month.sparen;
      month.dailyBudget = +(month.budget / (month.daysInMonth ?? 0)).toFixed;
      month.weeks?.forEach(week => {
        week.days.forEach(day => {
          day.budget = month.dailyBudget;
        });
        week.budget = week.daysInWeek * (month.dailyBudget ?? 0);
      });
    })
  }

  updateBuchungenForAllMonths(){
    this.userData.months().forEach(month => {
      month.weeks?.forEach(week => {
        week.days.forEach(day => {
          day.buchungen = [];
        })
      })
    })
    this.userData.buchungen.alleBuchungen.forEach(buchung => {
      const monthIndex = this.getIndexOfMonth(buchung.date);
      if(monthIndex === -1 || monthIndex === undefined) {
        return;
      }
      const weekIndex = this.userData.months()[monthIndex].weeks?.findIndex(week => {
        return week.days.find(day => day.date.toLocaleDateString() === buchung.date.toLocaleDateString());
      });
      if(weekIndex === -1) {
        return;
      }
      const dayIndex: number = this.userData.months!()[monthIndex!]!.weeks![weekIndex!]!.days.findIndex(day => day.date.toLocaleDateString() === buchung.date.toLocaleDateString())
      this.userData.months!()[monthIndex!]!.weeks![weekIndex!]!.days[dayIndex].buchungen!.push(buchung);
    });
    this.recalcAllIstBudgets();
  }

  editBuchung(buchung: Buchung){
    if(!this.checkIfMonthExistsForDay(buchung.date)){
      this.createNewMonth(buchung.date);
    }
    const buchungsIndexInAlleBuchungen = this.userData.buchungen.alleBuchungen.findIndex(pBuchung => pBuchung.id === buchung.id);
    if (buchungsIndexInAlleBuchungen === -1) {
      return;
    }
    this.userData.buchungen.alleBuchungen[buchungsIndexInAlleBuchungen] = buchung;
    this.updateBuchungenForAllMonths();
    this._fileEngine.save(this.convertToSavedData());
  }

  createBuchung(buchung: Buchung){
    if(!this.checkIfMonthExistsForDay(buchung.date)){
      this.createNewMonth(buchung.date);
    }
    buchung.id = this.getNextFreeBuchungsId();
    this.userData.buchungen.alleBuchungen.push(buchung);
    this.updateBuchungenForAllMonths();
    this._fileEngine.save(this.convertToSavedData());
  }

  deleteBuchung(buchungsId: number) {
    const buchungsIndexInAlleBuchungen = this.userData.buchungen.alleBuchungen.findIndex(pBuchung => pBuchung.id === buchungsId);
    if (buchungsIndexInAlleBuchungen === -1) {
      return;
    }
    this.userData.buchungen.alleBuchungen.splice(buchungsIndexInAlleBuchungen, 1);
    this.updateBuchungenForAllMonths();
    this._fileEngine.save(this.convertToSavedData());
  }

  createNewMonth(date: Date, totalBudget?: number, sparen?: number) {
    const year = new Date(date).getFullYear();
    const month = new Date(date).getMonth();
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);
    const budget = (totalBudget ?? 0) - (sparen ?? 0);

    // Berechnung der Anzahl der Tage im Monat
    const daysInMonth = endDate.getDate();

    const weeks: Week[] = [];

    const budgetPerDay: number = +(budget / daysInMonth).toFixed(2);

    let currentWeekStart = startDate;

    // Schleife durch die Wochen des Monats
    while (currentWeekStart <= endDate) {
      const currentWeekEnd = new Date(currentWeekStart);
      currentWeekEnd.setDate(currentWeekStart.getDate() + (6 - currentWeekStart.getDay()));

      // Sicherstellen, dass das Enddatum nicht über das Monatsende hinausgeht
      if (currentWeekEnd > endDate) {
        currentWeekEnd.setDate(endDate.getDate());
      }

      // Array von Day-Objekten für die aktuelle Woche erstellen
      const days: Day[] = [];
      for (let d = currentWeekStart.getDate(); d <= currentWeekEnd.getDate(); d++) {
        const dateForDay = new Date(currentWeekStart.getFullYear(), currentWeekStart.getMonth(), d)
        const buchungenForDay = this.userData.buchungen.alleBuchungen.filter(buchung => {
          const date = new Date(buchung.date);
          return date.toLocaleDateString() === dateForDay.toLocaleDateString()
        });
        days.push({ date: dateForDay, budget: budgetPerDay, istBudget: budgetPerDay, buchungen: buchungenForDay });
      }


      // Wochenobjekt erstellen und zum Array hinzufügen
      weeks.push({
        startDate: new Date(currentWeekStart),
        endDate: new Date(currentWeekEnd),
        daysInWeek: days.length,
        budget: budgetPerDay * days.length,
        istBudget: budgetPerDay * days.length,
        days: days
      });

      // Startdatum der nächsten Woche setzen
      currentWeekStart = new Date(currentWeekEnd);
      currentWeekStart.setDate(currentWeekStart.getDate() + 1);
    }

    const dailyBudget = +(budget / daysInMonth).toFixed(2);

    this.userData.months().push( {
      startDate: startDate,
      endDate: endDate,
      daysInMonth: daysInMonth,
      budget: budget ?? 0,
      istBudget: budget ?? 0,
      weeks: weeks,
      sparen: sparen ?? 0,
      dailyBudget: dailyBudget,
      totalBudget: totalBudget ?? 0

    });

    this.updateBuchungenForAllMonths();
    this.recalcBudgetsForMonth(date);
    this.recalcIstBudgetsForMonth(date);
  }

  changeSparenForMonth(date: Date, sparen: number){
    this.userData.months()[this.getIndexOfMonth(date)].sparen = sparen;
    this.recalcBudgetsForMonth(date);
    this.recalcIstBudgetsForMonth(date);
  }

  changeTotalBudgetForMonth(date: Date, totalBudget: number){
    this.userData.months()[this.getIndexOfMonth(date)].totalBudget = totalBudget;
    this.recalcBudgetsForMonth(date);
    this.recalcIstBudgetsForMonth(date);
  }

  getDayIstBudgets(date: Date): DayIstBudgets | null {
    const monthIndex = this.getIndexOfMonth(date);
    if(monthIndex === -1){
      return null;
    }
    const month = this.userData.months()[monthIndex];

    const weekIndex = this.getIndexOfWeekInMonth(date);
    if(weekIndex === -1){
      return null;
    }
    const week = this.userData.months()[monthIndex].weeks![this.getIndexOfWeekInMonth(date)];

    const dayIndex = this.getIndexOfDayInWeek(date);
    if(dayIndex === -1){
      return null;
    }
    const day = this.userData.months()[monthIndex].weeks![weekIndex].days![dayIndex];

    if(day.istBudget && week.istBudget && month.istBudget){
      return {
        dayIstBudget: day.istBudget,
        weekIstBudget: week.istBudget,
        monthIstBudget: month.istBudget
      }
    }
    return null;
  }

  getAllBuchungenForMonth(date: Date): Buchung[] | null {
    const buchungen: Buchung[] = [];
    const monthIndex = this.getIndexOfMonth(date);
    if(monthIndex === -1){
      return null;
    }
    this.userData.months()[monthIndex].weeks?.forEach(week => {
      week.days.forEach(day => {
        day.buchungen?.forEach(buchung => buchungen.push(buchung));
      })
    })
    return buchungen;
  }

  getAllBuchungenForYear(date: Date): Buchung[] {
    console.log('ERROR: getAllBuchungenForYear(date: Date): Buchung[] in dataService not yet implemented!');
    return [];
  }

  getAllBuchungen(): Buchung[] {
    return this.userData.buchungen.alleBuchungen;
  }

  getBudgetInfosForMonth(date: Date): BudgetInfosForMonth | null {
    const monthIndex = this.getIndexOfMonth(date);
    if(monthIndex === -1){
      return null;
    }
    const month = this.userData.months()[monthIndex];

    const weekIndex = this.getIndexOfWeekInMonth(date);
    if(weekIndex === -1){
      return null;
    }
    const week = this.userData.months()[monthIndex].weeks![this.getIndexOfWeekInMonth(date)];

    const dayIndex = this.getIndexOfDayInWeek(date);
    if(dayIndex === -1){
      return null;
    }
    const day = this.userData.months()[monthIndex].weeks![weekIndex].days![dayIndex];
    return {
      budget: month.budget ?? 0,
      sparen: month.sparen,
      totalBudget: month.totalBudget,
      istBudget: month.istBudget,
      dayBudget: month.dailyBudget ?? 0,
    }
  }

  getBuchungById(buchungsId: number) {
    return this.userData.buchungen.alleBuchungen.find(buchung => buchung.id === buchungsId);
  }

  private getIndexOfMonth(date: Date) {
    const year = new Date(date).getFullYear();
    const month = new Date(date).getMonth();
    const monthStartDate = new Date(year, month);
    return this.userData.months().findIndex(monat => monat.startDate.toLocaleDateString() === monthStartDate.toLocaleDateString())
  }

  private getIndexOfWeekInMonth(date: Date): number {
    const monthIndex = this.getIndexOfMonth(date);
    if(monthIndex === -1){
      return -1;
    }
    return this.userData.months()[this.getIndexOfMonth(date)].weeks?.findIndex(week => {
      week.days.find(day => day.date.toLocaleDateString() === date.toLocaleDateString());
    }) ?? -1;
  }

  private getIndexOfDayInWeek(date: Date) {
    const monthIndex = this.getIndexOfMonth(date);
    if(monthIndex === -1){
      return -1;
    }
    if(this.userData.months()[this.getIndexOfMonth(date)].weeks === undefined){
      return -1;
    }
    const weekIndex = this.getIndexOfWeekInMonth(date);
    if(weekIndex === -1 || weekIndex === undefined){
      return -1
    }
    return this.userData.months()[this.getIndexOfMonth(date)].weeks![weekIndex].days.findIndex(day => day.date.toLocaleDateString() === date.toLocaleDateString());
  }

  private checkIfMonthExistsForDay(date: Date): boolean {
    return this.userData.months().findIndex(month => month.startDate.getMonth() === date.getMonth()) !== -1;
  }

  private getMonthIndexes(buchungen?: Buchung[]): number[] {
    if(buchungen === undefined){
      return [];
    }
    // Erstelle ein Set, um doppelte Monate zu vermeiden
    const monthIndexes = new Set<number>();

    // Iteriere über das Array der Date-Objekte
    buchungen.forEach(buchung => {
      // Füge den Monat (Index) des aktuellen Date-Objekts zum Set hinzu
      monthIndexes.add(buchung.date.getMonth());
    })

    // Konvertiere das Set zurück in ein Array und gib es aus
    return Array.from(monthIndexes);
  }

  private convertToSavedData(): SavedData {
    const savedData: SavedData = {
      buchungen: [],
      savedMonths: []
    }

    savedData.buchungen = this.userData.buchungen.alleBuchungen;

    this.userData.months().forEach(month => {
      savedData.savedMonths.push({
        date: month.startDate,
        totalBudget: month.totalBudget,
        sparen: month.sparen
      })
    })

    return savedData;
  }

  private initializeUserData() {
    const savedData = this._fileEngine.load();

    //Converting SavedData to UserData
    this.userData = new UserData(savedData.buchungen);

    savedData.savedMonths.forEach(month => {
      this.createNewMonth(month.date, month.totalBudget, month.sparen)
    })
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

  /*

  public createNewBuchung(buchung: Buchung) {
    buchung.id = this.getNextFreeBuchungsId();
    this.createNewBuchungData(buchung);
  }

  public editBuchung(buchung: Buchung) {
    this.editBuchungData(buchung);
  }

  public deleteBuchung(buchungsId?: number) {
    if (buchungsId) {
      this.deleteBuchungData(buchungsId)
    }
  }

  public getBuchungById(buchungId: number): Buchung | undefined {
    return this.userData.buchungen.alleBuchungen.find(x => x.id === buchungId);
  }



  private createNewBuchungData(buchung: Buchung) {
    this.userData.buchungen.alleBuchungen.push(buchung);
    this.update();
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
    this.update();
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
    this.update();
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
          day.istBudget = (day.budget ?? 0) - dayAusgaben;
          weekAusgaben += dayAusgaben;
        });
        week.istBudget = (week.budget ?? 0) - weekAusgaben;
        monthAusgaben += weekAusgaben;
      });
      month.istBudget = (month.budget ?? 0) - monthAusgaben;
    });
  }

  private update() {
    this.updateBuchungenInMonths();
    this.recalculateIstBudgets();
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
  */
}

enum DB {
  short,
  mid,
  long,
  none
}
