export interface Month {
  totalBudget: number;
  sparen: number;
  startDate: Date;
  endDate?: Date;
  daysInMonth?: number;
  budget?: number;
  istBudget?: number;
  dailyBudget?: number;
  weeks?: Week[];
}

export interface Week {
  startDate: Date;
  endDate: Date;
  daysInWeek: number;
  budget?: number;
  istBudget?: number;
  days: Day[];
}

export interface Day {
  date: Date;
  budget?: number;
  istBudget?: number;
  buchungen?: Buchung[];
}

export interface Buchung {
  id?: number
  title: string
  betrag: number | null
  beschreibung?: string
  date: Date;
  time: string;
}

export interface ItfUserData {
  buchungen?: Buchung[],
  months: Month[]
}

export interface DayIstBudgets {
  monthIstBudget?: number;
  weekIstBudget?: number;
  dayIstBudget?: number;
}

export interface BudgetInfosForMonth {
  totalBudget: number;
  sparen: number;
  budget: number;
  dayBudget: number;
  istBudget?: number;
}

export interface SavedData {
  buchungen: Buchung[];
  savedMonths: SavedMonth[];
  fixKosten: FixKostenEintrag[];
}

export interface SavedMonth {
  date: Date;
  totalBudget: number;
  sparen: number;
}

export interface FixKostenEintrag {
  betrag: number;
  title: string;
  beschreibung?: string;
  periode?: null; //TODO Noch machen
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

export enum SideNavElements {
  home,
  budget,
  fixkosten
}

export enum Sites {
  home,
  budget,
  createBuchung,
  editBuchung,
  buchungDetails,
  fixKosten
}
