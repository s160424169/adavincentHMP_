import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

const KUNCI_PENYIMPANAN = 'simobile-mode-gelap';

@Injectable({ providedIn: 'root' })
export class Tema {
  private modeGelap$ = new BehaviorSubject<boolean>(this.bacaPreferensiAwal());
  darkMode$ = this.modeGelap$.asObservable();

  constructor() {
    this.terapkan(this.modeGelap$.value);
  }

  get isDarkMode(): boolean {
    return this.modeGelap$.value;
  }

  toggleModeGelap(aktif: boolean): void {
    this.modeGelap$.next(aktif);
    this.terapkan(aktif);
    localStorage.setItem(KUNCI_PENYIMPANAN, aktif ? '1' : '0');
  }

  private terapkan(aktif: boolean): void {
    document.documentElement.classList.toggle('ion-palette-dark', aktif);
  }

  private bacaPreferensiAwal(): boolean {
    const tersimpan = localStorage.getItem(KUNCI_PENYIMPANAN);
    if (tersimpan !== null) {
      return tersimpan === '1';
    }
    return !!(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
  }
}
