import { Component, OnInit, inject } from '@angular/core';
import { Produk } from '../services/produk';
import { Transaksi, DetailProdukTerlaris } from '../services/transaksi';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: false,
})
export class DashboardPage implements OnInit {
  private readonly produkService = inject(Produk);
  private readonly transaksiService = inject(Transaksi);

  // Data ringkasan yang dihitung oleh service (ditampilkan via interpolation binding)
  jumlahProduk: number = 0;
  totalStok: number = 0;
  totalTransaksiHariIni: number = 0;
  totalNominalHariIni: number = 0;
  produkTerlaris: string = '-';
  detailTerlaris: DetailProdukTerlaris = {
    nama: '-',
    totalTerjual: 0,
    totalPendapatan: 0,
  };

  tanggalHariIni: string = '';

  ngOnInit(): void {
    this.muatRingkasan();
  }

  ionViewWillEnter(): void {
    this.muatRingkasan();
  }

  /**
   * Memuat dan menghitung ringkasan data dari service
   */
  muatRingkasan(): void {
    // 1. Jumlah produk dihitung oleh Produk service
    this.jumlahProduk = this.produkService.hitungJumlahProduk();
    this.totalStok = this.produkService.hitungTotalStok();

    // 2. Total transaksi hari ini dihitung oleh Transaksi service
    this.totalTransaksiHariIni = this.transaksiService.hitungTotalTransaksiHariIni();
    this.totalNominalHariIni = this.transaksiService.hitungNominalTransaksiHariIni();

    // 3. Produk terlaris dihitung oleh Transaksi service
    this.produkTerlaris = this.transaksiService.hitungProdukTerlaris();
    this.detailTerlaris = this.transaksiService.hitungDetailProdukTerlaris();

    // Format tanggal hari ini
    const opsiTanggal: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    };
    this.tanggalHariIni = new Date().toLocaleDateString('id-ID', opsiTanggal);
  }

  /**
   * Format angka menjadi mata uang Rupiah
   */
  formatRupiah(nominal: number): string {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(nominal || 0);
  }

  /**
   * Handler untuk ion-refresher (pull-to-refresh)
   */
  doRefresh(event: CustomEvent): void {
    this.muatRingkasan();
    const target = event.target as HTMLIonRefresherElement;
    if (target && typeof target.complete === 'function') {
      target.complete();
    }
  }
}
