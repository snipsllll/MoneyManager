import {SavedData} from "./ClassesInterfacesEnums";

export class FileEngine {

  fileName: string = 'savedText.txt';
  useTestData = 0;
  download: boolean;

  constructor(useTestData: number, download: boolean) {
    this.useTestData = useTestData;
    this.download = download;
  }

  save(savedData: SavedData) {
    const blob = new Blob([JSON.stringify(savedData)], {type: 'text/plain'});
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = this.fileName;
    a.click();
    window.URL.revokeObjectURL(url);

    try {
      localStorage.setItem('savedText', JSON.stringify(savedData));
    } catch (e) {
      console.error('Fehler beim Speichern in localStorage:', e);
    }
  }

  load(): SavedData {
    if (this.useTestData !== 3) {
      return this.getTestData();
    } else {
      return this.getSavedData();
    }
  }

  private getSavedData() {
    return JSON.parse(this.loadTextFromLocalStorage(), (key, value) => {
      // Prüfen, ob der Wert ein ISO-8601 Datum ist
      if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value)) {
        return new Date(value); // Wenn ja, in ein Date-Objekt konvertieren
      }
      return value; // Ansonsten den Wert unverändert zurückgeben
    });
  }

  private loadTextFromLocalStorage(): string {
    try {
      const savedText = localStorage.getItem('savedText');
      if (savedText) {
        return savedText;
      }
    } catch (e) {
      console.error('Fehler beim laden aus localStorage:', e);
    }
    return '{"buchungen":[],"savedMonths":[]}';
  }

  private getTestData(): SavedData {
    return {
      buchungen: [
        {
          date: new Date(),
          id: 1,
          title: 'test titel',
          betrag: 2,
          time: new Date().toLocaleTimeString(),
          beschreibung: 'testbeschreibung'
        }
      ],
      savedMonths: [
        {
          date: new Date(),
          sparen: 100,
          totalBudget: 400
        }
      ]
    }
  }
}
