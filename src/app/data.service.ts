import { Injectable } from '@angular/core';
import {Eintrag} from "./Eintrag";

@Injectable({
  providedIn: 'root'
})
export class DataService {

  eintraege: Eintrag[] = [
    { id: 1, title: 'Eintrag 1', beschreibung: 'Beschreibung 1', date: '01.01.2024', time: '08:00', betrag: 100 },
    { id: 2, title: 'Eintrag 2', beschreibung: 'Beschreibung 2', date: '02.01.2024', time: '09:15', betrag: 200 },
    { id: 3, title: 'Eintrag 3', beschreibung: 'Beschreibung 3', date: '03.01.2024', time: '10:30', betrag: 300 },
    { id: 4, title: 'Eintrag 4', beschreibung: 'Beschreibung 4', date: '04.01.2024', time: '11:45', betrag: 400 },
    { id: 5, title: 'Eintrag 5', beschreibung: 'Beschreibung 5', date: '05.01.2024', time: '13:00', betrag: 500 },
    { id: 6, title: 'Eintrag 6', beschreibung: 'Beschreibung 6', date: '06.01.2024', time: '14:15', betrag: 600 },
    { id: 7, title: 'Eintrag 7', beschreibung: 'Beschreibung 7', date: '07.01.2024', time: '15:30', betrag: 700 },
    { id: 8, title: 'Eintrag 8', beschreibung: 'Beschreibung 8', date: '08.01.2024', time: '16:45', betrag: 800 },
    { id: 9, title: 'Eintrag 9', beschreibung: 'Beschreibung 9', date: '09.01.2024', time: '18:00', betrag: 900 },
    { id: 10, title: 'Eintrag 10', beschreibung: 'Beschreibung 10', date: '10.01.2024', time: '19:15', betrag: 1000 },
    { id: 11, title: 'Eintrag 11', beschreibung: 'Beschreibung 11', date: '11.01.2024', time: '20:30', betrag: 1100 },
    { id: 12, title: 'Eintrag 12', beschreibung: 'Beschreibung 12', date: '12.01.2024', time: '21:45', betrag: 1200 },
    { id: 13, title: 'Eintrag 13', beschreibung: 'Beschreibung 13', date: '13.01.2024', time: '22:00', betrag: 1300 },
    { id: 14, title: 'Eintrag 14', beschreibung: 'Beschreibung 14', date: '14.01.2024', time: '08:15', betrag: 1400 },
    { id: 15, title: 'Eintrag 15', beschreibung: 'Beschreibung 15', date: '15.01.2024', time: '09:30', betrag: 1500 },
    { id: 16, title: 'Eintrag 16', beschreibung: 'Beschreibung 16', date: '16.01.2024', time: '10:45', betrag: 1600 },
    { id: 17, title: 'Eintrag 17', beschreibung: 'Beschreibung 17', date: '17.01.2024', time: '12:00', betrag: 1700 },
    { id: 18, title: 'Eintrag 18', beschreibung: 'Beschreibung 18', date: '18.01.2024', time: '13:15', betrag: 1800 },
    { id: 19, title: 'Eintrag 19', beschreibung: 'Beschreibung 19', date: '19.01.2024', time: '14:30', betrag: 1900 },
    { id: 20, title: 'Eintrag 20', beschreibung: 'Beschreibung 20', date: '20.01.2024', time: '15:45', betrag: 2000 }
  ];

  constructor() { }

  getEintreage() {
    return this.eintraege;
  }

  getEintragById(eintragId: number): Eintrag | undefined {
    const x = this.eintraege.find(x => x.id === eintragId);
    console.log(x);
    return x;
  }
}
