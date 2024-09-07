import {Injectable, signal} from '@angular/core';
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

  updated = signal<number>(0);

  private _fileEngine = new FileEngine(this.testData, this.download);

  constructor() {
    this.initializeUserData();
  }

  recalcIstBudgetsForMonth(date: Date) {
    const month = this.userData.months()[this.getIndexOfMonth(date)];
    let monthAusgaben = 0;

    month.weeks?.forEach(week => {
      let weekAusgaben = 0;
      week.days.forEach(day => {
        let dayAusgaben = 0;
        day.buchungen?.forEach(buchung => {
          dayAusgaben += buchung.betrag ?? 0;
        });
        day.istBudget = +((day.budget ?? 0) - dayAusgaben).toFixed(2);
        weekAusgaben += dayAusgaben;
      });
      week.istBudget = +((week.budget ?? 0) - weekAusgaben).toFixed(2);
      monthAusgaben += weekAusgaben;
    });
    month.istBudget = +((month.budget ?? 0) - monthAusgaben).toFixed(2);

    this.userData.months()[this.getIndexOfMonth(date)] = month;
  }

  recalcAllIstBudgets() {
    this.userData.months().forEach(month => {
      let monthAusgaben = 0;

      month.weeks?.forEach(week => {
        let weekAusgaben = 0;
        week.days.forEach(day => {
          let dayAusgaben = 0;
          day.buchungen?.forEach(buchung => {
            dayAusgaben += buchung.betrag ?? 0;
          });
          day.istBudget = +((day.budget ?? 0) - dayAusgaben).toFixed(2);
          weekAusgaben += dayAusgaben;
        });
        week.istBudget = +((week.budget ?? 0) - weekAusgaben).toFixed(2);
        monthAusgaben += weekAusgaben;
      });
      month.istBudget = +((month.budget ?? 0) - monthAusgaben).toFixed(2);
    });
  }

  recalcBudgetsForMonth(date: Date) {
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
    this.recalcIstBudgetsForMonth(date);
  }

  recalcAllBudgets() {
    this.userData.months().forEach(month => {
      month.budget = month.totalBudget - month.sparen;
      month.dailyBudget = +(month.budget / (month.daysInMonth ?? 0)).toFixed(2);
      month.weeks?.forEach(week => {
        week.days.forEach(day => {
          day.budget = month.dailyBudget;
        });
        week.budget = week.daysInWeek * (month.dailyBudget ?? 0);
      });
    })
    this.recalcAllIstBudgets();
  }

  updateBuchungenForAllMonths() {
    this.userData.months().forEach(month => {
      month.weeks?.forEach(week => {
        week.days.forEach(day => {
          day.buchungen = [];
        })
      })
    })
    this.userData.buchungen.alleBuchungen.forEach(buchung => {
      if(!this.checkIfMonthExistsForDay(buchung.date)){
        this.createNewMonth(buchung.date);
      }
      const monthIndex = this.getIndexOfMonth(buchung.date);
      if (monthIndex === -1 || monthIndex === undefined) {
        return;
      }
      const weekIndex = this.userData.months()[monthIndex].weeks?.findIndex(week => {
        return week.days.find(day => day.date.toLocaleDateString() === buchung.date.toLocaleDateString());
      });
      if (weekIndex === -1) {
        return;
      }
      const dayIndex: number = this.userData.months!()[monthIndex!]!.weeks![weekIndex!]!.days.findIndex(day => day.date.toLocaleDateString() === buchung.date.toLocaleDateString())
      this.userData.months!()[monthIndex!]!.weeks![weekIndex!]!.days[dayIndex].buchungen!.push(buchung);
    });
    this.recalcAllIstBudgets();
  }

  editBuchung(buchung: Buchung) {
    if (!this.checkIfMonthExistsForDay(buchung.date)) {
      this.createNewMonth(buchung.date);
    }
    const buchungsIndexInAlleBuchungen = this.userData.buchungen.alleBuchungen.findIndex(pBuchung => pBuchung.id === buchung.id);
    if (buchungsIndexInAlleBuchungen === -1) {
      return;
    }
    this.userData.buchungen.alleBuchungen[buchungsIndexInAlleBuchungen] = buchung;
    this.updateBuchungenForAllMonths();
  }

  createBuchung(buchung: Buchung) {
    if (!this.checkIfMonthExistsForDay(buchung.date)) {
      this.createNewMonth(buchung.date);
    }
    buchung.id = this.getNextFreeBuchungsId();
    this.userData.buchungen.alleBuchungen.push(buchung);
    this.updateBuchungenForAllMonths();
  }

  deleteBuchung(buchungsId: number) {
    const buchungsIndexInAlleBuchungen = this.userData.buchungen.alleBuchungen.findIndex(pBuchung => pBuchung.id === buchungsId);
    if (buchungsIndexInAlleBuchungen === -1) {
      return;
    }
    this.userData.buchungen.alleBuchungen.splice(buchungsIndexInAlleBuchungen, 1);
    this.updateBuchungenForAllMonths();
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
      let currentWeekEnd = this.getSunday(currentWeekStart);

      // Sicherstellen, dass das Enddatum nicht über das Monatsende hinausgeht
      if (currentWeekEnd > endDate) {
        currentWeekEnd = endDate;
      }

      // Array von Day-Objekten für die aktuelle Woche erstellen
      const days: Day[] = [];
      for (let d = currentWeekStart.getDate(); d <= currentWeekEnd.getDate(); d++) {
        const dateForDay = new Date(currentWeekStart.getFullYear(), currentWeekStart.getMonth(), d)
        const buchungenForDay = this.userData.buchungen.alleBuchungen.filter(buchung => {
          const date = new Date(buchung.date);
          return date.toLocaleDateString() === dateForDay.toLocaleDateString()
        });
        days.push({date: dateForDay, budget: budgetPerDay, istBudget: budgetPerDay, buchungen: buchungenForDay});
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
      currentWeekStart = this.getNextMonday(currentWeekStart);
    }

    const dailyBudget = +(budget / daysInMonth).toFixed(2);

    this.userData.months().push({
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
    console.log(this.userData)
  }

  changeSparenForMonth(date: Date, sparen: number) {
    if (!this.checkIfMonthExistsForDay(date)) {
      this.createNewMonth(date);
    }
    this.userData.months()[this.getIndexOfMonth(date)].sparen = sparen;
    this.recalcBudgetsForMonth(date);
    this.recalcIstBudgetsForMonth(date);
  }

  changeTotalBudgetForMonth(date: Date, totalBudget: number) {
    if (!this.checkIfMonthExistsForDay(date)) {
      this.createNewMonth(date);
    }
    this.userData.months()[this.getIndexOfMonth(date)].totalBudget = totalBudget;
    this.recalcBudgetsForMonth(date);
    this.recalcIstBudgetsForMonth(date);
  }

  getDayIstBudgets(date: Date): DayIstBudgets | null {
    const monthIndex = this.getIndexOfMonth(date);
    if (monthIndex === -1) {
      return null;
    }
    const month = this.userData.months()[monthIndex];

    const weekIndex = this.getIndexOfWeekInMonth(date);
    if (weekIndex === -1) {
      return null;
    }
    const week = this.userData.months()[monthIndex].weeks![this.getIndexOfWeekInMonth(date)];

    const dayIndex = this.getIndexOfDayInWeek(date);
    if (dayIndex === -1) {
      return null;
    }
    const day = this.userData.months()[monthIndex].weeks![weekIndex].days![dayIndex];

    return {
      dayIstBudget: day.istBudget ?? undefined,
      weekIstBudget: week.istBudget ?? undefined,
      monthIstBudget: month.istBudget ?? undefined
    }
  }

  getAllBuchungenForMonth(date: Date): Buchung[] | null {
    const buchungen: Buchung[] = [];
    const monthIndex = this.getIndexOfMonth(date);
    if (monthIndex === -1) {
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
    if (monthIndex === -1) {
      return null;
    }
    const month = this.userData.months()[monthIndex];

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

  update() {
    this._fileEngine.save(this.getSavedData());
    this.updated.set(this.updated() + 1);
  }

  private getIndexOfMonth(date: Date) {
    const year = new Date(date).getFullYear();
    const month = new Date(date).getMonth();
    const monthStartDate = new Date(year, month);
    return this.userData.months().findIndex(monat => monat.startDate.toLocaleDateString() === monthStartDate.toLocaleDateString())
  }

  private getIndexOfWeekInMonth(date: Date): number {
    const monthIndex = this.getIndexOfMonth(date);
    if (monthIndex === -1) {
      return -1;
    }
    const x = this.userData.months()[monthIndex].weeks?.findIndex(week => {
      return week.days.find(day => day.date.toLocaleDateString() === date.toLocaleDateString());
    });

    if (x === undefined) {
      console.log('week not found')
      return -1;
    }
    return x;
  }

  private getIndexOfDayInWeek(date: Date) {
    const monthIndex = this.getIndexOfMonth(date);
    if (monthIndex === -1) {
      return -1;
    }
    if (this.userData.months()[this.getIndexOfMonth(date)].weeks === undefined) {
      return -1;
    }
    const weekIndex = this.getIndexOfWeekInMonth(date);
    if (weekIndex === -1 || weekIndex === undefined) {
      return -1
    }
    return this.userData.months()[this.getIndexOfMonth(date)].weeks![weekIndex].days.findIndex(day => day.date.toLocaleDateString() === date.toLocaleDateString());
  }

  private checkIfMonthExistsForDay(date: Date): boolean {
    return this.userData.months().findIndex(month => month.startDate.getMonth() === date.getMonth()) !== -1;
  }

  private getMonthIndexes(buchungen?: Buchung[]): number[] {
    if (buchungen === undefined) {
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

  private getSavedData(): SavedData {
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
  private getMonday(inputDate: Date): Date {
    // Clone the input date to avoid mutating the original date
    const date = new Date(inputDate);

    // Get the day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
    const dayOfWeek = date.getDay();

    // Calculate the difference between the current day and Monday (day 1)
    const diff = (dayOfWeek + 6) % 7; // This ensures Sunday goes back 6 days, Monday stays at 0

    // Set the date to the Monday of the current week
    date.setDate(date.getDate() - diff);

    // Return the Monday date
    return date;
  }

  private getSunday(inputDate: Date): Date {
    // Clone the input date to avoid mutating the original date
    const date = new Date(inputDate);

    // Get the day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
    const dayOfWeek = date.getDay();

    // Calculate the difference to reach Sunday (day 0)
    const diff = 7 - dayOfWeek; // If it's already Sunday, the diff will be 7

    // Set the date to the upcoming Sunday
    date.setDate(date.getDate() + (dayOfWeek === 0 ? 0 : diff));

    // Return the Sunday date
    return date;
  }

  private getNextMonday(date: Date): Date {
    // Create a new date object to avoid mutating the original date
    const result = new Date(date);

    // Get the current day of the week (0 is Sunday, 1 is Monday, etc.)
    const currentDay = result.getDay();

    // Find the offset to the next Monday
    const daysUntilNextMonday = (8 - currentDay) % 7 || 7;

    // Set the date to the next Monday
    result.setDate(result.getDate() + daysUntilNextMonday);

    // Return the next Monday
    return result;
  }
}

enum DB {
  short,
  mid,
  long,
  none
}
