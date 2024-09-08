import {Injectable, signal} from '@angular/core';
import {UserData} from "../UserData";
import {FileEngine} from "../FileEngine";
import {
  Buchung,
  BudgetInfosForMonth,
  Day,
  DayIstBudgets,
  FixKostenEintrag, Month,
  SavedData, UpdateValues,
  Week
} from "../ClassesInterfacesEnums";

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

  update(updateValues: UpdateValues) {
    updateValues.months.forEach(month => {
      //checken obs den monat schon gibt. Wenn nicht, dann neuen Monat erstellen
      if(!this.checkIfMonthExistsForDay(month.date)){
        this.createNewMonth(month.date);
      }

      //Wenn neue Buchungen angelegt wurden, dann neue Buchungen zu userData.buchungen.allebuchungen hinzufügen
      if(month.newBuchungen !== undefined) {
        month.newBuchungen.forEach(buchung => {
          this.userData.buchungen.alleBuchungen.push(buchung);
        })
      }

      //Wenn Buchungen gelöscht wurden, dann Buchungen aus userData.buchungen.alleBuchungen entfernen
      if(month.deletedBuchungsIds !== undefined){
        month.deletedBuchungsIds.forEach(buchungsId => {
          this.userData.buchungen.alleBuchungen.splice(this.getIndexOfBuchungById(buchungsId), 1);
        })
      }

      //Wenns bearbeitete Buchungen gibt, dann Buchungen in userData.buchungen.alleBuchungen anpassen
      if(month.editedBuchungen !== undefined) {
        month.editedBuchungen.forEach(buchung => {
          this.userData.buchungen.alleBuchungen[this.getIndexOfBuchungById(buchung.id)] = buchung;
        })
      }

      //Wenn sparen geändert wurde
      if(month.newSparen !== undefined) {
        this.userData.months()[this.getIndexOfMonth(month.date)].sparen = month.newSparen;
      }

      //Wenn totalBudget geändert wurde
      if(month.newTotalBudget !== undefined) {
        this.userData.months()[this.getIndexOfMonth(month.date)].totalBudget = month.newTotalBudget;
      }

      //Wenn maxDayBudget geändert wurde
      if(month.newMaxDayBudget !== undefined) {
        //TODO
      }

      //Wenn neue Fixkosteneinträge vorhanden, dann zu userData.fixKosten hinzufügen
      if(month.newFixkostenEintraege !== undefined) {
        month.newFixkostenEintraege.forEach(fixKostenEintrag => {
          this.userData.fixKosten.push(fixKostenEintrag);
        })
      }

      //Wenn FixkostenEinträge gelöscht wurden, dann aus userData.fixKosten entfernen
      if(month.deletedFixkostenEintreageIds !== undefined) {
        month.deletedFixkostenEintreageIds.forEach(fixKostenEintragsId => {
          this.userData.fixKosten.splice(this.getFixKostenIndex(fixKostenEintragsId!),1);
        })
      }

      //Wenn Fixkosteneinträge verändert wurden, dann in userData.fixKosten anpassen
      if(month.newFixkostenEintraege !== undefined) {
        month.newFixkostenEintraege.forEach(fixKostenEintrag => {
          this.userData.fixKosten[this.getFixKostenIndex(fixKostenEintrag.id!)] = fixKostenEintrag;
        })
      }

      //Buchungen in Monat zu den jeweiligen Tagen hinzufügen/updaten
      this.updateBuchungenForMonth(month.date);


      /*Weird and crazy stuff beginns here*/

      this.calcDaysInMonthForMonth(month.date);

      this.calcDailyBudgetForMonth(month.date);

      this.calcBudgetForMonth(month.date);

      this.calcBudgetsForAllDaysInMonth(month.date);

      this.calcBudgetsForAllWeeksInMonth(month.date);

      this.calcIstBudgetsForAllDaysInMonth(month.date);

      this.calcIstBudgetsForAllWeeksInMonth(month.date);

      this.calcIstBudgetForMonth(month.date);

      //TODO this.calcLeftOverMoneyForMotnh(month.date);
    });
    this.save();
    this.sendUpdateToComponents();
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
    month.budget = month.totalBudget! - (month.sparen! + this.getFixKostenSumme());
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
      month.budget = month.totalBudget! - (month.sparen! + this.getFixKostenSumme());
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
        this.createNewMonthOld(buchung.date);
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
      this.createNewMonthOld(buchung.date);
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
      this.createNewMonthOld(buchung.date);
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

  createFixKostenEintrag(fixKostenEintrag: FixKostenEintrag) {
    fixKostenEintrag.id = this.getNextFreeFixKostenId();
    this.userData.fixKosten.push(fixKostenEintrag);
    this.recalcAllBudgets();
    this.updateOld();
  }

  editFixKostenEintrag(fixKostenEintrag: FixKostenEintrag) {
    if(!fixKostenEintrag.id)
      return;
    const index = this.getFixKostenIndex(fixKostenEintrag.id);
    if(index === -1) {
      console.error(`FixkostenEintrag für id: ${fixKostenEintrag.id} konnte nicht gefunden werden!`);
      return;
    }
    this.userData.fixKosten[index] = fixKostenEintrag;
    this.recalcAllBudgets();
    this.updateOld();
  }

  deleteFixKostenEintrag(id: number) {
    const index = this.getFixKostenIndex(id);
    if(index === -1) {
      console.error(`FixkostenEintrag für id: ${id} konnte nicht gefunden werden!`);
      return;
    }
    this.userData.fixKosten.splice(index, 1);
    this.recalcAllBudgets();
    this.recalcAllIstBudgets();
    this.updateOld();
  }

  createNewMonthOld(date: Date, totalBudget?: number, sparen?: number) {
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
      this.createNewMonthOld(date);
    }
    this.userData.months()[this.getIndexOfMonth(date)].sparen = sparen;
    this.recalcBudgetsForMonth(date);
    this.recalcIstBudgetsForMonth(date);
  }

  changeTotalBudgetForMonth(date: Date, totalBudget: number) {
    if (!this.checkIfMonthExistsForDay(date)) {
      this.createNewMonthOld(date);
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
      sparen: month.sparen ?? 0,
      totalBudget: month.totalBudget ?? 0,
      istBudget: month.istBudget,
      dayBudget: month.dailyBudget ?? 0,
      fixKosten: this.getFixKostenSumme()
    }
  }

  getBuchungById(buchungsId: number) {
    return this.userData.buchungen.alleBuchungen.find(buchung => buchung.id === buchungsId);
  }

  getFixKostenSumme() {
    let summe = 0;
    this.userData.fixKosten.forEach(eintrag => {
      summe += eintrag.betrag;
    })
    return summe;
  }

  updateOld() {
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
      savedMonths: [],
      fixKosten: []
    }

    savedData.buchungen = this.userData.buchungen.alleBuchungen;
    savedData.fixKosten = this.userData.fixKosten;

    this.userData.months().forEach(month => {
      savedData.savedMonths.push({
        date: month.startDate,
        totalBudget: month.totalBudget ?? 0,
        sparen: month.sparen ?? 0
      })
    })

    return savedData;
  }

  private initializeUserData() {
    const savedData = this._fileEngine.load();

    //Converting SavedData to UserData
    this.userData = new UserData();
    this.userData.buchungen.alleBuchungen = savedData.buchungen;
    this.userData.fixKosten = savedData.fixKosten;

    savedData.savedMonths.forEach(month => {
      this.createNewMonthOld(month.date, month.totalBudget, month.sparen)
    })
    this.recalcAllBudgets();
    this.recalcAllIstBudgets();
    this.updateBuchungenForAllMonths();
    if(this.testData !== 3){
      this.updateOld()
    }
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

  private getNextFreeFixKostenId() {
    let freeId = 1;
    for (let i = 0; i < this.userData.fixKosten.length; i++) {
      if (this.userData.fixKosten.find(x => x.id === freeId) === undefined) {
        return freeId;
      } else {
        freeId++;
      }
    }
    return freeId;
  }

  private getFixKostenIndex(id: number) {
    return this.userData.fixKosten.findIndex(eintrag => eintrag.id === id);
  }

  private calcIstBudgetForMonth(date: Date) { //TODO testen
    const month = this.userData.months()[this.getIndexOfMonth(date)];

    /*Algorithm start*/
    if(month.budget === undefined) {
      console.error('undefined at month.budget is not allowed! (dataService: calcIstBudgetForMonth)');
      return;
    }
    month.istBudget = month.budget - this.getAusgabenSummeForMonth(date);
    /*Algorithm end*/

    this.setMonth(month);
  }

  private calcIstBudgetsForAllWeeksInMonth(date: Date) { //TODO testen
    const month = this.getMonthByDate(date);

    /*Algorithm start*/
    month.weeks?.forEach(week => {
      let weekIstBudget = 0;
      week.days.forEach(day => {
        if(day.istBudget === undefined) {
          this.logUndefinedError('day.istBudget', 'calcIstBudgetForAllWekksInMonth()');
          return;
        }
        weekIstBudget += day.istBudget;
      });
      week.istBudget = weekIstBudget;
    })
    /*Algorithm end*/

    this.setMonth(month)
  }

  private calcIstBudgetsForAllDaysInMonth(date: Date) { //TODO testen
    const month = this.getMonthByDate(date);

    /*Algorithm start*/
    month.weeks?.forEach(week => {
      week.days.forEach(day => {
        if(day.budget === undefined) {
          this.logUndefinedError('day.budget', 'calcIstBudgetsForAllDaysInMonth()');
          return;
        }
        let dayAusgaben = 0;
        day.buchungen?.forEach(buchung => {
          dayAusgaben += (buchung.betrag ?? 0);
        })
        day.istBudget = day.budget - dayAusgaben;
      })
    })
    /*Algorithm end*/

    this.setMonth(month)
  }

  private calcBudgetsForAllWeeksInMonth(date: Date) { //TODO
    const month = this.getMonthByDate(date);

    /*Algorithm start*/
    if(month.dailyBudget === undefined) {
      this.logUndefinedError('month.dailyBudget', 'calcBudgetsForAllWeeksInMonth()');
      return;
    }

    month.weeks?.forEach(week => {
      if(month.dailyBudget === undefined) {
        this.logUndefinedError('week.daysInWeek', 'calcBudgetsForAllWeeksInMonth()');
        return;
      }
      week.budget = week.daysInWeek * month.dailyBudget!;
    })
    /*Algorithm end*/

    this.setMonth(month)
  }

  private calcBudgetsForAllDaysInMonth(date: Date) { //TODO testen
    const month = this.getMonthByDate(date);

    /*Algorithm start*/
    if(month.dailyBudget === undefined) {
      this.logUndefinedError('month.dailyBudget', 'calcBudgetsForAllDaysInMonth()');
      return;
    }

    month.weeks?.forEach(week => {
      week.days.forEach(day => {
        day.budget = month.dailyBudget;
      })
    })
    /*Algorithm end*/

    this.setMonth(month)
  }

  private calcDailyBudgetForMonth(date: Date) { //TODO testen
    const month = this.getMonthByDate(date);

    /*Algorithm start*/
    if(month.daysInMonth === undefined) {
      this.logUndefinedError('month.daysInMonth', 'calcDailyBudgetForMonth()');
      return;
    }

    if(month.totalBudget === undefined) {
      this.logUndefinedError('month.totalBudget', 'calcDailyBudgetForMonth');
      return;
    }

    month.dailyBudget = +((month.totalBudget - (month.sparen ?? 0) - (this.getFixKostenSumme() ?? 0)) / month.daysInMonth).toFixed(2);
    /*Algorithm end*/

    this.setMonth(month);
  }

  private calcDaysInMonthForMonth(date: Date) { //TODO testen
    const month = this.getMonthByDate(date);

    /*Algorithm start*/
    month.daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    /*Algorithm end*/

    this.setMonth(month);
  }

  private updateBuchungenForMonth(date: Date) { //TODO testen
    const month = this.getMonthByDate(date);

    /*Algorithm start*/
    month.weeks!.forEach(week => {
      week.days.forEach(day => {
        day.buchungen = this.userData.buchungen.alleBuchungen.filter(buchung => buchung.date.toLocaleDateString() === day.date.toLocaleDateString());
      })
    })
    /*Algorithm end*/

    this.setMonth(month);
  }

  private getIndexOfBuchungById(id: number | undefined) { //TODO testen
    return this.userData.buchungen.alleBuchungen.findIndex(buchung => buchung.id === id);
  }

  createNewMonth(date: Date) { //TODO
    console.log(1)
    const startDate: Date = new Date(date.getFullYear(), date.getMonth(), 1);
    const endDate: Date = new Date(date.getFullYear(), date.getMonth() + 1, 0); //TODO testen
    const daysInMonth: number = endDate.getDate() - startDate.getDate();

    const weeks: Week[] = [];

    let weekStartDate = startDate;

    while(weekStartDate.getDate() <= endDate.getDate() && weekStartDate.getMonth() <= endDate.getMonth()) {
      let weekEndDate: Date = this.getSunday(weekStartDate);

      if(weekEndDate.getMonth() > endDate.getMonth()){
        weekEndDate = endDate;
      }

      const daysInWeek = weekEndDate.getDate() - weekStartDate.getDate(); //TODO testen
      const days: Day[] = [];

      for (let d = weekStartDate.getDate(); d <= weekEndDate.getDate(); d++) {
        const dateForDay = new Date(weekStartDate.getFullYear(), weekStartDate.getMonth(), d);
        days.push({date: dateForDay});
      }

      weeks.push({
        startDate: weekStartDate,
        endDate: weekEndDate,
        daysInWeek: daysInWeek,
        days: days
      });

      weekStartDate = this.getNextMonday(weekStartDate);
    }

    const month: Month = {
      startDate: startDate,
      endDate: endDate,
      daysInMonth: daysInMonth,
      weeks: weeks
    }

    this.userData.months().push(month);
  }

  private save() { //TODO testen
    this._fileEngine.save(this.getSavedData());
  }

  private sendUpdateToComponents() { //TODO testen
    this.updated.set(this.updated() + 1);
  }

  private getAusgabenSummeForMonth(date: Date) { //TODO testen
    const month = this.userData.months()[this.getIndexOfMonth(date)];
    let ausgabenSumme = 0;
    month.weeks?.forEach(week => {
      week.days.forEach(day => {
        day.buchungen?.forEach(buchung => {
          ausgabenSumme += (buchung.betrag ?? 0);
        })
      })
    })
    return ausgabenSumme;
  }

  private getMonthByDate(date: Date) {
    return this.userData.months()[this.getIndexOfMonth(date)];
  }

  private logUndefinedError(varName: string, methodName: string) {
    console.error(`undefined at ${varName} is not allowed! (in: ${methodName})`);
  }

  private setMonth(month: Month) {
    this.userData.months()[this.getIndexOfMonth(month.startDate)] = month;
  }

  private isUndefined(input: any) {
    if(input === undefined) {
      return true;
    }
    return false;
  }

  private calcBudgetForMonth(date: Date) {
    const month = this.getMonthByDate(date);

    if(month.daysInMonth === undefined || month.totalBudget === undefined || month.dailyBudget === undefined) {
      this.logUndefinedError('something', 'calcBubdgetForMonth()');
      return;
    }

    /*Algorithm start*/
    month.budget = +(month.dailyBudget * month.daysInMonth).toFixed(2);
    /*Algorithm end*/

    this.setMonth(month);
  }
}

enum DB {
  short,
  mid,
  long,
  none
}
