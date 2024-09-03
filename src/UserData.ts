import {Buchung} from "./app/Buchung";
import {Buchungen} from "./Buchungen";

export class UserData {

  public monthBudget: MonthBudget;
  public buchungen: Buchungen;

  constructor(budget: number, month: Months, alleBuchungen?: Buchung[]) {
    this.monthBudget = this.getDefaultBudgetForMonth(budget, month);
    this.buchungen = new Buchungen(alleBuchungen)
  }

  getDefaultBudgetForMonth(budget: number, month: Months){
    const date = new Date(2024, month );
    const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
    const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    // Berechnung der Anzahl der Tage im Monat
    const daysInMonth = endDate.getDate();

    const weeks: Week[] = [];
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
        days.push({ date: new Date(currentWeekStart.getFullYear(), currentWeekStart.getMonth(), d) });
      }

      // Wochenobjekt erstellen und zum Array hinzufügen
      weeks.push({
        startDate: new Date(currentWeekStart),
        endDate: new Date(currentWeekEnd),
        daysInWeek: days.length,
        days
      });

      // Startdatum der nächsten Woche setzen
      currentWeekStart = new Date(currentWeekEnd);
      currentWeekStart.setDate(currentWeekStart.getDate() + 1);
    }

    return new MonthBudget({
      startDate,
      endDate,
      daysInMonth,
      weeks
    }, budget);
  }
}

class MonthBudget {
  istMonth: Month;
  readonly startMonth: Month;

  constructor(monthDetails: Month, budget: number) {
    this.istMonth = monthDetails;
    this.istMonth.budget = budget;
    const dailyBudget = +(this.istMonth.budget / this.istMonth.daysInMonth).toFixed(2);
    this.istMonth.weeks.forEach(week => {
      week.budget = dailyBudget * week.daysInWeek;
      week.days.forEach(day => {
        day.budget = dailyBudget;
      })
    })
    this.startMonth = this.istMonth;
  }
}

type Week = {
  startDate: Date;
  endDate: Date;
  daysInWeek: number;
  budget?: number;
  days: Day[];
};

type Month = {
  startDate: Date;
  endDate: Date;
  daysInMonth: number;
  weeks: Week[];
  budget?: number;
};

type Day = {
  date: Date;
  budget?: number;
}

function toJsonString(input: any) {
  return JSON.stringify(input, null, 4);
}

function formatTime(date: Date): string {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

export enum Months {
  Januar,
  Februar,
  Maerz,
  April,
  Mai,
  Juni,
  Juli,
  August,
  September,
  Oktober,
  Novermber,
  Dezember
}
