import { Component, OnDestroy, OnInit } from '@angular/core';
import { Tema } from '../services/tema';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-pengaturan',
  templateUrl: './pengaturan.page.html',
  styleUrls: ['./pengaturan.page.scss'],
  standalone: false,
})
export class PengaturanPage implements OnInit, OnDestroy {
  modeGelap = false;
  private langganan? : Subscription;

  

  constructor(private tema: Tema) { }

  ngOnInit() {
    this.langganan = this.tema.darkMode$.subscribe((aktif) => (this.modeGelap = aktif));
  }

  ngOnDestroy(): void {
    this.langganan?.unsubscribe();
  }

  onToggleModeGelap(event: CustomEvent<{ checked: boolean }>): void {
    const aktif = event.detail.checked;
    this.tema.toggleModeGelap(aktif);
  }
}
