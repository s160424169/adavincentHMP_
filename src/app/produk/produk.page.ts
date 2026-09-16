import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Produk, ProdukItem } from '../services/produk';

@Component({
  selector: 'app-produk',
  templateUrl: './produk.page.html',
  styleUrls: ['./produk.page.scss'],
  standalone: false,
})
export class ProdukPage implements OnInit {
  private readonly produkService = inject(Produk);
  private readonly router = inject(Router);

  daftarProduk: ProdukItem[] = [];
  daftarKategori: string[] = [];
  kategoriAktif: string = 'Semua';
  kataKunciCari: string = '';

  ngOnInit(): void {
    this.muatProduk();
  }

  ionViewWillEnter(): void {
    this.muatProduk();
  }

  muatProduk(): void {
    this.daftarKategori = this.produkService.semuaKategori();
    this.terapkanFilter();
  }

  onCari(event: CustomEvent): void {
    const value = (event.detail as { value?: string }).value || '';
    this.kataKunciCari = value;
    this.terapkanFilter();
  }

  onPilihKategori(kategori: string): void {
    this.kategoriAktif = kategori;
    this.terapkanFilter();
  }

  terapkanFilter(): void {
    let hasil = this.produkService.semuaProduk();

    // Filter kategori
    if (this.kategoriAktif && this.kategoriAktif !== 'Semua') {
      hasil = hasil.filter((p) => p.kategori === this.kategoriAktif);
    }

    // Filter pencarian
    if (this.kataKunciCari && this.kataKunciCari.trim() !== '') {
      const q = this.kataKunciCari.toLowerCase().trim();
      hasil = hasil.filter(
        (p) =>
          p.nama.toLowerCase().includes(q) ||
          p.kategori.toLowerCase().includes(q) ||
          p.id.toLowerCase().includes(q) ||
          (p.barcode && p.barcode.includes(q))
      );
    }

    this.daftarProduk = hasil;
  }

  bukaDetail(id: string): void {
    this.router.navigate(['/produk/detail', id]);
  }

  formatRupiah(nominal: number): string {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(nominal || 0);
  }

  doRefresh(event: CustomEvent): void {
    this.muatProduk();
    const target = event.target as HTMLIonRefresherElement;
    if (target && typeof target.complete === 'function') {
      target.complete();
    }
  }
}
