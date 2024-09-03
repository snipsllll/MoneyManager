import {Injectable} from '@angular/core';
import {Buchung} from "./Buchung";
import {UserData} from "../UserData";
import {FileEngine} from "../FileEngine";

@Injectable({
  providedIn: 'root'
})

export class DataService {

  userData: UserData;
  useTestData: boolean = true;
  download: boolean = true;

  private fileEngine = new FileEngine(this.useTestData, this.download);

  constructor() {
    if(this.useTestData){
      this.userData = this.fileEngine.getTestData();
    } else {
      this.userData = this.fileEngine.getSavedUserData();
    }
    console.log(this.userData);
    this.fileEngine.test()
  }

  getAlleBuchungen() {
    return this.userData.buchungen.alleBuchungen;
  }

  getBuchungById(buchungId: number): Buchung | undefined {
    return this.userData.buchungen.alleBuchungen.find(x => x.id === buchungId);
  }

  deleteBuchung(buchungId: number){
    const indexOfBuchung = this.userData.buchungen.alleBuchungen.findIndex(x => x.id === buchungId);
    this.userData.buchungen.alleBuchungen.splice(indexOfBuchung, 1);
    this.fileEngine.save(this.userData);
  }

  addBuchung(buchung: Buchung) {
    buchung.id = this.getNextFreeBuchungsId();
    this.userData.buchungen.alleBuchungen.push(buchung);
    this.fileEngine.save(this.userData.buchungen.alleBuchungen);
  }

  editBuchung(buchung: Buchung) {
    const buchungIndex = this.userData.buchungen.alleBuchungen.findIndex(x => x.id === buchung.id);
    this.userData.buchungen.alleBuchungen[buchungIndex] = buchung;
    this.fileEngine.save(this.userData.buchungen.alleBuchungen);
  }

  getBuchungenByDay(date: string){
    return this.userData.buchungen.alleBuchungen.filter(x => x.date === date);
  }

  getBuchungenForCurrentWeek(){
    return this.filterThisWeek(this.userData.buchungen.alleBuchungen)
  }

  getBuchungenForThisMonth() {
    return this.filterThisMonth(this.userData.buchungen.alleBuchungen);
  }

  private getNextFreeBuchungsId(){
    let freeId = 1;
    for(let i = 0; i<this.userData.buchungen.alleBuchungen.length; i++){
      if(this.userData.buchungen.alleBuchungen.find(x => x.id === freeId) === undefined) {
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

  private filterThisWeek(buchungen: Buchung[]): Buchung[] {
    const today = new Date();
    const startOfWeek = this.getStartOfWeek(today);
    const endOfWeek = this.getEndOfWeek(today);

    return buchungen.filter(buchung => {
      const buchungDate = this.parseDate(buchung.date);
      return buchungDate !== null && buchungDate >= startOfWeek && buchungDate <= endOfWeek;
    });
  }

  private parseDate(dateStr: string): Date | null {
    const [day, month, year] = dateStr.split('.').map(Number);
    if (!day || !month || !year) {
      return null; // Invalid date format
    }
    return new Date(year, month - 1, day);
  }

  private filterThisMonth(buchungen: Buchung[]): Buchung[] {
    const today = new Date();
    const startOfMonth = this.getStartOfMonth(today);
    const endOfMonth = this.getEndOfMonth(today);

    return buchungen.filter(buchung => {
      const buchungDate = this.parseDate(buchung.date);
      return buchungDate !== null && buchungDate >= startOfMonth && buchungDate <= endOfMonth;
    });
  }

  private getStartOfMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0);
  }

  private getEndOfMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
  }
}
