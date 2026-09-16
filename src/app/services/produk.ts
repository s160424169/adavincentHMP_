import { Injectable } from '@angular/core';

export interface ProdukItem {
  id: string;
  nama: string;
  kategori: string;
  harga: number;
  stok: number;
  terjual?: number;
}

const KUNCI_PENYIMPANAN_PRODUK = 'simobile-daftar-produk';

@Injectable({
  providedIn: 'root',
})
export class Produk {
  private daftarProduk: ProdukItem[] = [];

  constructor() {
    this.muatDataAwal();
  }

  /**
   * Mengambil semua data produk
   */
  semuaProduk(): ProdukItem[] {
    return [...this.daftarProduk];
  }

  /**
   * Menghitung total jumlah produk yang terdaftar
   */
  hitungJumlahProduk(): number {
    return this.daftarProduk.length;
  }

  /**
   * Menghitung total stok dari semua produk
   */
  hitungTotalStok(): number {
    return this.daftarProduk.reduce((total, p) => total + (p.stok || 0), 0);
  }

  /**
   * Mengambil produk berdasarkan ID
   */
  getProdukById(id: string): ProdukItem | undefined {
    return this.daftarProduk.find((p) => p.id === id);
  }

  /**
   * Menambah produk baru
   */
  tambahProduk(item: ProdukItem): void {
    this.daftarProduk.push(item);
    this.simpanKeStorage();
  }

  /**
   * Memperbarui data produk
   */
  updateProduk(id: string, update: Partial<ProdukItem>): void {
    const idx = this.daftarProduk.findIndex((p) => p.id === id);
    if (idx !== -1) {
      this.daftarProduk[idx] = { ...this.daftarProduk[idx], ...update };
      this.simpanKeStorage();
    }
  }

  private simpanKeStorage(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(KUNCI_PENYIMPANAN_PRODUK, JSON.stringify(this.daftarProduk));
    }
  }

  private muatDataAwal(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      const data = localStorage.getItem(KUNCI_PENYIMPANAN_PRODUK);
      if (data) {
        try {
          this.daftarProduk = JSON.parse(data);
          return;
        } catch {
          // fallback jika parse gagal
        }
      }
    }

    // Data awal Toko Makmur Jaya
    this.daftarProduk = [
      { id: 'P001', nama: 'Minyak Goreng Bimoli 2L', kategori: 'Sembako', harga: 38000, stok: 45, terjual: 35 },
      { id: 'P002', nama: 'Beras Rojo Lele 5kg', kategori: 'Sembako', harga: 72000, stok: 30, terjual: 20 },
      { id: 'P003', nama: 'Gula Pasir Gulaku 1kg', kategori: 'Sembako', harga: 17500, stok: 50, terjual: 28 },
      { id: 'P004', nama: 'Telur Ayam Negeri 1kg', kategori: 'Sembako', harga: 28000, stok: 40, terjual: 25 },
      { id: 'P005', nama: 'Mie Instan Indomie Goreng', kategori: 'Makanan', harga: 3500, stok: 120, terjual: 80 },
      { id: 'P006', nama: 'Kopi Kapal Api Spesial 165g', kategori: 'Minuman', harga: 14000, stok: 35, terjual: 18 },
      { id: 'P007', nama: 'Susu Kental Manis Frisian Flag', kategori: 'Minuman', harga: 13000, stok: 40, terjual: 22 },
      { id: 'P008', nama: 'Teh Celup Sariwangi 25s', kategori: 'Minuman', harga: 7500, stok: 60, terjual: 15 },
      { id: 'P009', nama: 'Sabun Mandi Lifebuoy 85g', kategori: 'Kebersihan', harga: 5000, stok: 55, terjual: 30 },
      { id: 'P100', nama: 'Air Mineral Aqua 600ml', kategori: 'Minuman', harga: 4000, stok: 80, terjual: 42 }
    ];

    this.simpanKeStorage();
  }
}

// Alias untuk fleksibilitas impor
export { Produk as ProdukService };
