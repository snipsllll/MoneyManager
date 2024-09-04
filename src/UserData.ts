
import {Buchungen} from "./Buchungen";
import {Buchung, Day, ItfUserData, Month, Months, Week} from "./ClassesInterfacesEnums";

export class UserData {

  public buchungen: Buchungen;
  public months: Month[] = [];

  constructor(budget: number, alleBuchungen?: Buchung[]) {
    const allExistingMonths = this.getMonthIndexes(alleBuchungen)
    this.buchungen = new Buchungen(alleBuchungen);
    allExistingMonths.forEach(monthIndex => {
      this.generateNewMonth(new Date(2024, monthIndex), budget);
    })
  }



  public generateNewMonth(date: Date, budget?: number){
    if(budget === undefined){
      budget = 0;
    }
    const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
    const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);

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
        const buchungenForDay = this.buchungen.alleBuchungen.filter(buchung => buchung.date.toLocaleDateString() === dateForDay.toLocaleDateString());
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

    this.months.push( {
      startDate: startDate,
      endDate: endDate,
      daysInMonth: daysInMonth,
      budget: budget ?? 0,
      istBudget: budget ?? 0,
      weeks: weeks
    });

    this.recalculateIstBudgets();
  }

  private recalculateIstBudgets() {
    this.months.forEach(month => {
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
}
