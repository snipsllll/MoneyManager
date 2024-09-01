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

  downloadTextFile(): void {
    const blob = new Blob([this.textContent], { type: 'text/plain' });
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

  loadTextFromFile(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = (e) => {
        this.textContent = e.target?.result as string;
      };

      reader.readAsText(file);
    }
  }

  loadTextFromLocalStorage(): void {
    try {
      const savedText = localStorage.getItem('savedText');
      if (savedText) {
        this.textContent = JSON.parse(savedText);
      }
    } catch (e) {
      console.error('Fehler beim Laden aus localStorage:', e);
      this.textContent = ''; // Setze den Textinhalt auf leer, falls Parsing fehlschlägt
    }
  }

  save(object: any) {
    this.textContent = JSON.stringify(object);
    this.downloadTextFile();
  }

  /*


  textContent: string = '';
  fileName: string = 'savedText.txt';

  ngOnInit(): void {
    this.save({});
    this.loadTextFromLocalStorage();
  }



  load() {
    return JSON.parse(this.getTextFromLocalStorage());
  }

  downloadTextFile(): void {
    const blob = new Blob([this.textContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = this.fileName;
    a.click();
    window.URL.revokeObjectURL(url);

    // Speichern des Textes in localStorage
    localStorage.setItem('savedText', this.textContent);
  }

  loadTextFromFile(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = (e) => {
        this.textContent = e.target?.result as string;
      };

      reader.readAsText(file);
    }
  }

  loadTextFromLocalStorage(): void {
    const jsonString = localStorage.getItem('savedText');
    if (jsonString) {
      try {
        this.textContent = JSON.parse(jsonString);
        // Verarbeitung der Daten
      } catch (e) {
        console.error('Fehler beim Parsen des JSON:', e);
      }
    } else {
      console.warn('Keine Daten zum Parsen vorhanden');
    }
  }

  getTextFromLocalStorage(): string {
    const savedText = localStorage.getItem('savedText');
    if (savedText) {
      return savedText;
    }
    return '';
  }*/
}
