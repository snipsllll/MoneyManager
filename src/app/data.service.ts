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
}
