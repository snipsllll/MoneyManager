import { Injectable } from '@angular/core';
import {Eintrag} from "./Eintrag";
import {FileSaveService} from "./file-save.service";

@Injectable({
  providedIn: 'root'
})

export class DataService {

  eintraege: Eintrag[] = [];

  constructor(private fileSaver: FileSaveService) {
    this.fileSaver.ngOnInit();
    if(this.fileSaver.textContent === null){
            this.fileSaver.load()
    }
    this.eintraege = JSON.parse(this.fileSaver.textContent);
  }

  getEintreage() {
    return this.eintraege;
  }

  getEintragById(eintragId: number): Eintrag | undefined {
    return this.eintraege.find(x => x.id === eintragId);
  }

  deleteEintrag(eintragId: number){
    const indexOfEintrag = this.eintraege.findIndex(x => x.id === eintragId);
    this.eintraege.splice(indexOfEintrag, 1);
    this.fileSaver.save(this.eintraege);
  }

  addEintrag(eintrag: Eintrag) {
    eintrag.id = this.getFreeEintragId();
    this.eintraege.push(eintrag);
    this.fileSaver.save(this.eintraege);
  }

  editEintrag(eintrag: Eintrag) {
    const eintragIndex = this.eintraege.findIndex(x => x.id === eintrag.id);
    this.eintraege[eintragIndex] = eintrag;
    this.fileSaver.save(this.eintraege);
  }

  getEintraegeByDay(date: string){
    return this.eintraege.filter(x => x.date === date);
  }

  getEintraegeByWeek(){
    return this.filterThisWeek(this.eintraege)
  }

  getEintraegeByMonth() {
    return this.filterThisMonth(this.eintraege);
  }

  private getFreeEintragId(){
    let freeId = 1;
    for(let i = 0; i<this.eintraege.length; i++){
      if(this.eintraege.find(x => x.id === freeId) === undefined) {
        return freeId;
      } else {
        freeId++;
      }
    }
    return freeId;
  }

  private getStartOfWeek(date: Date): Date {
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    startOfWeek.setDate(diff);
    startOfWeek.setHours(0, 0, 0, 0);
    return startOfWeek;
  }

  private getEndOfWeek(date: Date): Date {
    const endOfWeek = new Date(this.getStartOfWeek(date));
    endOfWeek.setDate(endOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);
    return endOfWeek;
  }

  private filterThisWeek(eintraege: Eintrag[]): Eintrag[] {
    const today = new Date();
    const startOfWeek = this.getStartOfWeek(today);
    const endOfWeek = this.getEndOfWeek(today);

    return eintraege.filter(eintrag => {
      const entryDate = this.parseDate(eintrag.date);
      return entryDate !== null && entryDate >= startOfWeek && entryDate <= endOfWeek;
    });
  }

  private parseDate(dateStr: string): Date | null {
    const [day, month, year] = dateStr.split('.').map(Number);
    if (!day || !month || !year) {
      return null; // Invalid date format
    }
    return new Date(year, month - 1, day);
  }

  private filterThisMonth(eintraege: Eintrag[]): Eintrag[] {
    const today = new Date();
    const startOfMonth = this.getStartOfMonth(today);
    const endOfMonth = this.getEndOfMonth(today);

    return eintraege.filter(eintrag => {
      const entryDate = this.parseDate(eintrag.date);
      return entryDate !== null && entryDate >= startOfMonth && entryDate <= endOfMonth;
    });
  }

  private getStartOfMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0);
  }

  private getEndOfMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
  }
}
