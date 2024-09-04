export interface Month {
  startDate: Date;
  endDate: Date;
  daysInMonth: number;
  budget: number;
  istBudget: number;
  weeks: Week[];
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
