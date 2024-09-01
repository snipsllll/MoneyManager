export interface Eintrag {

  id: number
  title: string
  betrag: number
  beschreibung?: string
  date: string;
  time: string;

}

export interface DateTime {
  date: string;
  time: string;
}
