import {Injectable, OnInit} from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class FileSaveService implements OnInit {

  textContent: string = '';
  fileName: string = 'savedText.txt';

  ngOnInit(): void {
    this.loadTextFromLocalStorage();
  }

  save(object: any) {
    this.textContent = JSON.stringify(object);
    this.downloadTextFile();
  }

  load() {
    this.downloadTextFile();
  }

  private downloadTextFile(): void {
    const blob = new Blob([this.textContent], {type: 'text/plain'});
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = this.fileName;
    a.click();
    window.URL.revokeObjectURL(url);

    try {
      localStorage.setItem('savedText', JSON.stringify(this.textContent));
    } catch (e) {
      console.error('Fehler beim Speichern in localStorage:', e);
    }
  }

  private loadTextFromLocalStorage(): void {
    try {
      const savedText = localStorage.getItem('savedText');
      if (savedText) {
        this.textContent = JSON.parse(savedText);
      }
    } catch (e) {
      console.error('Fehler beim Laden aus localStorage:', e);
      this.textContent = '';
    }
  }
}
