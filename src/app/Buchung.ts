export interface Buchung {
  id: number
  title: string
  betrag: number | null
  beschreibung?: string
  date: string;
  time: string;
}
