import {UserData} from "./UserData";
import {Buchung} from "./ClassesInterfacesEnums";

export class FileEngine {

  fileName: string = 'savedText.txt';
  useTestData = true;
  download = false;
  userData!: UserData;

  constructor(useTestData: boolean, download: boolean) {
    this.useTestData = useTestData;
    this.download = download;
    if (this.useTestData) {
      this.userData = this.getTestData();
      this.save();
    } else {
      this.userData = this.getSavedUserData();
    }
  }

  public save(): void {
    if (this.download) {
      const blob = new Blob([JSON.stringify(this.userData)], {type: 'text/plain'});
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = this.fileName;
      a.click();
      window.URL.revokeObjectURL(url);

      try {
        localStorage.setItem('savedText', JSON.stringify(this.userData));
      } catch (e) {
        console.error('Fehler beim Speichern in localStorage:', e);
      }
    }
  }

  private loadTextFromLocalStorage(): string {
    try {
      const savedText = localStorage.getItem('savedText');
      if (savedText) {
        return savedText;
      }
    } catch (e) {
      const x = JSON.stringify(new UserData(0, []));
      console.log(x);
      return x;
    }
    return '{}';
  }

  private parseDate(dateStr: string): Date | null {
    const [day, month, year] = dateStr.split('.').map(Number);
    if (!day || !month || !year) {
      return null; // Invalid date format
    }
    return new Date(year, month - 1, day);
  }

  //NICHT ANPACKEN!!!
  private getSavedUserData() {
    return JSON.parse(this.loadTextFromLocalStorage(), (key, value) => {
      // Prüfen, ob der Wert ein ISO-8601 Datum ist
      if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value)) {
        return new Date(value); // Wenn ja, in ein Date-Objekt konvertieren
      }
      return value; // Ansonsten den Wert unverändert zurückgeben
    });
  }

  private getTestData() {
    const testDataBuchungen: Buchung[] = [
      {
        id: 1,
        title: 'Eintrag 1',
        beschreibung: 'Beschreibung 1',
        date: this.parseDate('1.1.2024')!,
        time: '08:00',
        betrag: 100
      },
      {
        id: 2,
        title: 'Eintrag 2',
        beschreibung: 'Beschreibung 2',
        date: this.parseDate('2.1.2024')!,
        time: '09:15',
        betrag: 200
      },
      {
        id: 3,
        title: 'Eintrag 3',
        beschreibung: 'Beschreibung 3',
        date: this.parseDate('3.1.2024')!,
        time: '10:30',
        betrag: 300
      },
      {
        id: 4,
        title: 'Eintrag 4',
        beschreibung: 'Beschreibung 4',
        date: this.parseDate('4.1.2024')!,
        time: '11:45',
        betrag: 400
      },
      {
        id: 5,
        title: 'Eintrag 5',
        beschreibung: 'Beschreibung 5',
        date: this.parseDate('5.1.2024')!,
        time: '13:00',
        betrag: 500
      },
      {
        id: 6,
        title: 'Eintrag 6',
        beschreibung: 'Beschreibung 6',
        date: this.parseDate('6.1.2024')!,
        time: '14:15',
        betrag: 600
      },
      {
        id: 7,
        title: 'Eintrag 7',
        beschreibung: 'Beschreibung 7',
        date: this.parseDate('7.1.2024')!,
        time: '15:30',
        betrag: 700
      },
      {
        id: 8,
        title: 'Eintrag 8',
        beschreibung: 'Beschreibung 8',
        date: this.parseDate('8.1.2024')!,
        time: '16:45',
        betrag: 800
      },
      {
        id: 9,
        title: 'Eintrag 9',
        beschreibung: 'Beschreibung 9',
        date: this.parseDate('9.1.2024')!,
        time: '18:00',
        betrag: 900
      },
      {
        id: 10,
        title: 'Eintrag 10',
        beschreibung: 'Beschreibung 10',
        date: this.parseDate('10.1.2024')!,
        time: '19:15',
        betrag: 1000
      },
      {
        id: 11,
        title: 'Eintrag 11',
        beschreibung: 'Beschreibung 11',
        date: this.parseDate('11.1.2024')!,
        time: '20:30',
        betrag: 1100
      },
      {
        id: 12,
        title: 'Eintrag 12',
        beschreibung: 'Beschreibung 12',
        date: this.parseDate('12.1.2024')!,
        time: '21:45',
        betrag: 1200
      },
      {
        id: 13,
        title: 'Eintrag 13',
        beschreibung: 'Beschreibung 13',
        date: this.parseDate('13.1.2024')!,
        time: '22:00',
        betrag: 1300
      },
      {
        id: 14,
        title: 'Eintrag 14',
        beschreibung: 'Beschreibung 14',
        date: this.parseDate('14.1.2024')!,
        time: '08:15',
        betrag: 1400
      },
      {
        id: 15,
        title: 'Eintrag 15',
        beschreibung: 'Beschreibung 15',
        date: this.parseDate('30.8.2024')!,
        time: '09:30',
        betrag: 1500
      },
      {
        id: 16,
        title: 'Eintrag 16',
        beschreibung: 'Beschreibung 16',
        date: this.parseDate('2.9.2024')!,
        time: '10:45',
        betrag: 1600
      },
      {
        id: 17,
        title: 'Eintrag 17',
        beschreibung: 'Beschreibung 17',
        date: this.parseDate('2.9.2024')!,
        time: '12:00',
        betrag: 1700
      },
      {
        id: 18,
        title: 'Eintrag 18',
        beschreibung: 'Beschreibung 18',
        date: this.parseDate('1.9.2024')!,
        time: '13:15',
        betrag: 1800
      },
      {
        id: 19,
        title: 'Eintrag 19',
        beschreibung: 'Beschreibung 19',
        date: this.parseDate('1.9.2024')!,
        time: '14:30',
        betrag: 1900
      },
      {
        id: 20,
        title: 'Eintrag 20',
        beschreibung: 'Beschreibung 20',
        date: this.parseDate('1.9.2024')!,
        time: '15:45',
        betrag: 2000
      },
    ];
    return new UserData(400, testDataBuchungen);
  }
}
