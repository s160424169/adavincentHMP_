import { Injectable, inject } from '@angular/core';
import { Produk } from './produk';

export interface ItemTransaksi {
  produkId: string;
  namaProduk: string;
  harga: number;
  jumlah: number;
  subtotal: number;
}

export interface TransaksiData {
  id: string;
  nomorTransaksi: string;
  tanggal: string; // Format ISO string e.g. "2026-09-16T14:30:00"
  items: ItemTransaksi[];
  total: number;
  metodePembayaran: string;
  status: string;
}

export interface DetailProdukTerlaris {
  nama: string;
  totalTerjual: number;
  totalPendapatan: number;
}

export interface RingkasanDashboard {
  jumlahProduk: number;
  totalTransaksiHariIni: number;
  totalNominalHariIni: number;
  produkTerlaris: string;
  detailTerlaris: DetailProdukTerlaris;
}

const KUNCI_PENYIMPANAN_TRANSAKSI = 'simobile-daftar-transaksi';

@Injectable({
  providedIn: 'root',
})
export class Transaksi {
  private readonly produkService = inject(Produk);
  private daftarTransaksi: TransaksiData[] = [];

  constructor() {
    this.muatDataAwal();
  }

  /**
   * Mengambil semua daftar transaksi
   */
  semuaTransaksi(): TransaksiData[] {
    return [...this.daftarTransaksi];
  }

  /**
   * Menghitung total jumlah transaksi yang dilakukan HARI INI
   */
  hitungTotalTransaksiHariIni(): number {
    return this.getTransaksiHariIni().length;
  }

  /**
   * Alias untuk hitungTotalTransaksiHariIni
   */
  hitungJumlahTransaksiHariIni(): number {
    return this.hitungTotalTransaksiHariIni();
  }

  /**
   * Menghitung total nominal (Rupiah) dari semua transaksi HARI INI
   */
  hitungNominalTransaksiHariIni(): number {
    return this.getTransaksiHariIni().reduce((total, trx) => total + (trx.total || 0), 0);
  }

  /**
   * Menghitung produk terlaris berdasarkan total kuantitas terjual dari transaksi
   */
  hitungProdukTerlaris(): string {
    const detail = this.hitungDetailProdukTerlaris();
    return detail.nama || 'Belum ada data';
  }

  /**
   * Mengambil informasi detail produk terlaris (nama, kuantitas terjual, total omzet)
   */
  hitungDetailProdukTerlaris(): DetailProdukTerlaris {
    if (this.daftarTransaksi.length === 0) {
      return { nama: '-', totalTerjual: 0, totalPendapatan: 0 };
    }

    const rekap: { [nama: string]: { totalTerjual: number; totalPendapatan: number } } = {};

    for (const trx of this.daftarTransaksi) {
      if (trx.items && Array.isArray(trx.items)) {
        for (const item of trx.items) {
          if (!rekap[item.namaProduk]) {
            rekap[item.namaProduk] = { totalTerjual: 0, totalPendapatan: 0 };
          }
          rekap[item.namaProduk].totalTerjual += item.jumlah;
          rekap[item.namaProduk].totalPendapatan += item.subtotal;
        }
      }
    }

    let topNama = '-';
    let topTerjual = 0;
    let topPendapatan = 0;

    for (const [nama, data] of Object.entries(rekap)) {
      if (data.totalTerjual > topTerjual) {
        topTerjual = data.totalTerjual;
        topNama = nama;
        topPendapatan = data.totalPendapatan;
      }
    }

    return {
      nama: topNama,
      totalTerjual: topTerjual,
      totalPendapatan: topPendapatan,
    };
  }

  /**
   * Menghitung seluruh ringkasan dashboard sekaligus
   */
  hitungRingkasanDashboard(): RingkasanDashboard {
    return {
      jumlahProduk: this.produkService.hitungJumlahProduk(),
      totalTransaksiHariIni: this.hitungTotalTransaksiHariIni(),
      totalNominalHariIni: this.hitungNominalTransaksiHariIni(),
      produkTerlaris: this.hitungProdukTerlaris(),
      detailTerlaris: this.hitungDetailProdukTerlaris(),
    };
  }

  /**
   * Mengambil daftar transaksi yang tercatat pada hari ini
   */
  getTransaksiHariIni(): TransaksiData[] {
    const sekarang = new Date();
    return this.daftarTransaksi.filter((trx) => {
      try {
        const tgl = new Date(trx.tanggal);
        return (
          tgl.getFullYear() === sekarang.getFullYear() &&
          tgl.getMonth() === sekarang.getMonth() &&
          tgl.getDate() === sekarang.getDate()
        );
      } catch {
        return false;
      }
    });
  }

  /**
   * Menambah transaksi baru
   */
  tambahTransaksi(transaksi: TransaksiData): void {
    this.daftarTransaksi.unshift(transaksi);
    this.simpanKeStorage();
  }

  private simpanKeStorage(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(KUNCI_PENYIMPANAN_TRANSAKSI, JSON.stringify(this.daftarTransaksi));
    }
  }

  private muatDataAwal(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      const data = localStorage.getItem(KUNCI_PENYIMPANAN_TRANSAKSI);
      if (data) {
        try {
          const parsed = JSON.parse(data);
          if (Array.isArray(parsed) && parsed.length > 0) {
            this.daftarTransaksi = parsed;
            return;
          }
        } catch {
          // fallback jika parse gagal
        }
      }
    }

    // Inisialisasi transaksi simulasi dengan tanggal dinamis (hari ini dan hari sebelumnya)
    const sekarang = new Date();
    const buatTanggalHariIni = (jam: number, menit: number): string => {
      const d = new Date(sekarang);
      d.setHours(jam, menit, 0, 0);
      return d.toISOString();
    };

    const buatTanggalKemarin = (hariLalu: number, jam: number, menit: number): string => {
      const d = new Date(sekarang);
      d.setDate(d.getDate() - hariLalu);
      d.setHours(jam, menit, 0, 0);
      return d.toISOString();
    };

    this.daftarTransaksi = [
      {
        id: 'TRX-001',
        nomorTransaksi: 'TRX-2026-0001',
        tanggal: buatTanggalHariIni(8, 30),
        items: [
          { produkId: 'P005', namaProduk: 'Mie Instan Indomie Goreng', harga: 3500, jumlah: 10, subtotal: 35000 },
          { produkId: 'P001', namaProduk: 'Minyak Goreng Bimoli 2L', harga: 38000, jumlah: 2, subtotal: 76000 },
        ],
        total: 111000,
        metodePembayaran: 'Tunai',
        status: 'Selesai',
      },
      {
        id: 'TRX-002',
        nomorTransaksi: 'TRX-2026-0002',
        tanggal: buatTanggalHariIni(10, 15),
        items: [
          { produkId: 'P005', namaProduk: 'Mie Instan Indomie Goreng', harga: 3500, jumlah: 25, subtotal: 87500 },
          { produkId: 'P003', namaProduk: 'Gula Pasir Gulaku 1kg', harga: 17500, jumlah: 3, subtotal: 52500 },
          { produkId: 'P006', namaProduk: 'Kopi Kapal Api Spesial 165g', harga: 14000, jumlah: 2, subtotal: 28000 },
        ],
        total: 168000,
        metodePembayaran: 'QRIS',
        status: 'Selesai',
      },
      {
        id: 'TRX-003',
        nomorTransaksi: 'TRX-2026-0003',
        tanggal: buatTanggalHariIni(12, 45),
        items: [
          { produkId: 'P002', namaProduk: 'Beras Rojo Lele 5kg', harga: 72000, jumlah: 1, subtotal: 72000 },
          { produkId: 'P004', namaProduk: 'Telur Ayam Negeri 1kg', harga: 28000, jumlah: 2, subtotal: 56000 },
          { produkId: 'P005', namaProduk: 'Mie Instan Indomie Goreng', harga: 3500, jumlah: 5, subtotal: 17500 },
        ],
        total: 145500,
        metodePembayaran: 'Tunai',
        status: 'Selesai',
      },
      {
        id: 'TRX-004',
        nomorTransaksi: 'TRX-2026-0004',
        tanggal: buatTanggalHariIni(14, 20),
        items: [
          { produkId: 'P005', namaProduk: 'Mie Instan Indomie Goreng', harga: 3500, jumlah: 15, subtotal: 52500 },
          { produkId: 'P100', namaProduk: 'Air Mineral Aqua 600ml', harga: 4000, jumlah: 6, subtotal: 24000 },
        ],
        total: 76500,
        metodePembayaran: 'QRIS',
        status: 'Selesai',
      },
      {
        id: 'TRX-005',
        nomorTransaksi: 'TRX-2026-0005',
        tanggal: buatTanggalHariIni(16, 10),
        items: [
          { produkId: 'P001', namaProduk: 'Minyak Goreng Bimoli 2L', harga: 38000, jumlah: 1, subtotal: 38000 },
          { produkId: 'P005', namaProduk: 'Mie Instan Indomie Goreng', harga: 3500, jumlah: 8, subtotal: 28000 },
          { produkId: 'P008', namaProduk: 'Teh Celup Sariwangi 25s', harga: 7500, jumlah: 2, subtotal: 15000 },
        ],
        total: 81000,
        metodePembayaran: 'Tunai',
        status: 'Selesai',
      },
      {
        id: 'TRX-006',
        nomorTransaksi: 'TRX-2026-0006',
        tanggal: buatTanggalKemarin(1, 11, 0),
        items: [
          { produkId: 'P002', namaProduk: 'Beras Rojo Lele 5kg', harga: 72000, jumlah: 2, subtotal: 144000 },
          { produkId: 'P005', namaProduk: 'Mie Instan Indomie Goreng', harga: 3500, jumlah: 12, subtotal: 42000 },
        ],
        total: 186000,
        metodePembayaran: 'Transfer',
        status: 'Selesai',
      },
      {
        id: 'TRX-007',
        nomorTransaksi: 'TRX-2026-0007',
        tanggal: buatTanggalKemarin(2, 15, 30),
        items: [
          { produkId: 'P001', namaProduk: 'Minyak Goreng Bimoli 2L', harga: 38000, jumlah: 3, subtotal: 114000 },
          { produkId: 'P005', namaProduk: 'Mie Instan Indomie Goreng', harga: 3500, jumlah: 10, subtotal: 35000 },
        ],
        total: 149000,
        metodePembayaran: 'Tunai',
        status: 'Selesai',
      },
    ];

    this.simpanKeStorage();
  }
}

// Alias untuk fleksibilitas impor
export { Transaksi as TransaksiService };
