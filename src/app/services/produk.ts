import { Injectable } from '@angular/core';

export interface ProdukItem {
  id: string;
  nama: string;
  kategori: string;
  harga: number;
  stok: number;
  satuan: string;
  deskripsi: string;
  barcode?: string;
  supplier?: string;
  terjual?: number;
  icon?: string;
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
   * Mengambil seluruh data produk
   */
  semuaProduk(): ProdukItem[] {
    return [...this.daftarProduk];
  }

  /**
   * Menghitung total jumlah varian produk
   */
  hitungJumlahProduk(): number {
    return this.daftarProduk.length;
  }

  /**
   * Menghitung total stok seluruh produk
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
   * Mencari produk berdasarkan kata kunci (nama / kategori / id)
   */
  cariProduk(kataKunci: string): ProdukItem[] {
    if (!kataKunci || kataKunci.trim() === '') {
      return this.semuaProduk();
    }
    const q = kataKunci.toLowerCase().trim();
    return this.daftarProduk.filter(
      (p) =>
        p.nama.toLowerCase().includes(q) ||
        p.kategori.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q)
    );
  }

  /**
   * Menyaring produk berdasarkan kategori
   */
  filterByKategori(kategori: string): ProdukItem[] {
    if (!kategori || kategori === 'Semua') {
      return this.semuaProduk();
    }
    return this.daftarProduk.filter((p) => p.kategori === kategori);
  }

  /**
   * Mengambil daftar seluruh kategori unik
   */
  semuaKategori(): string[] {
    const setKategori = new Set(this.daftarProduk.map((p) => p.kategori));
    return ['Semua', ...Array.from(setKategori)];
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
          const parsed = JSON.parse(data);
          if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].deskripsi) {
            this.daftarProduk = parsed;
            return;
          }
        } catch {
          // fallback jika parse gagal
        }
      }
    }

    // Katalog produk sembako Toko Makmur Jaya
    this.daftarProduk = [
      {
        id: 'P001',
        nama: 'Beras Rojo Lele Super 5kg',
        kategori: 'Sembako',
        harga: 72000,
        stok: 35,
        satuan: 'karung',
        terjual: 28,
        barcode: '899100100101',
        supplier: 'UD Sumber Beras Delanggu',
        deskripsi: 'Beras pulen kualitas super pilihan keluarga. Bersih, alami tanpa pemutih dan tanpa pengawet. Cocok untuk hidangan nasi harian keluarga.',
        icon: 'nutrition-outline',
      },
      {
        id: 'P002',
        nama: 'Minyak Goreng Bimoli Klasik 2L',
        kategori: 'Minyak & Lemak',
        harga: 38000,
        stok: 45,
        satuan: 'pouch',
        terjual: 45,
        barcode: '899100100202',
        supplier: 'PT Salim Ivomas Pratama',
        deskripsi: 'Minyak goreng kelapa sawit murni berkualitas tinggi. Mengandung Vitamin A dan E alami, menjaga masakan tetap renyah, gurih, dan tahan panas.',
        icon: 'water-outline',
      },
      {
        id: 'P003',
        nama: 'Gula Pasir Gulaku Tebu Alami 1kg',
        kategori: 'Sembako',
        harga: 17500,
        stok: 50,
        satuan: 'kg',
        terjual: 36,
        barcode: '899100100303',
        supplier: 'PT Sugar Group Companies',
        deskripsi: 'Gula pasir tebu alami dengan butiran putih bersih dan kristal halus. Memberikan rasa manis murni untuk masakan, kue, dan aneka minuman keluarga.',
        icon: 'cube-outline',
      },
      {
        id: 'P004',
        nama: 'Telur Ayam Ras Negeri Segar 1kg',
        kategori: 'Sembako',
        harga: 28000,
        stok: 40,
        satuan: 'kg',
        terjual: 30,
        barcode: '899100100404',
        supplier: 'Peternakan Ayam Makmur Blitar',
        deskripsi: 'Telur ayam ras segar langsung dari peternakan terpercaya. Sumber protein hewani terbaik, cangkang kokoh, kuning telur oranye pekat bernutrisi tinggi.',
        icon: 'egg-outline',
      },
      {
        id: 'P005',
        nama: 'Tepung Terigu Segitiga Biru 1kg',
        kategori: 'Tepung & Gandum',
        harga: 13500,
        stok: 60,
        satuan: 'kg',
        terjual: 24,
        barcode: '899100100505',
        supplier: 'PT Bogasari Flour Mills',
        deskripsi: 'Tepung terigu serbaguna protein sedang. Sangat pas untuk membuat berbagai macam bolu, kue basah, martabak, donat, dan gorengan renyah.',
        icon: 'sparkles-outline',
      },
      {
        id: 'P006',
        nama: 'Mie Instan Indomie Goreng Spesial',
        kategori: 'Makanan Instan',
        harga: 3500,
        stok: 120,
        satuan: 'bungkus',
        terjual: 95,
        barcode: '899100100606',
        supplier: 'PT Indofood CBP Sukses Makmur',
        deskripsi: 'Mie instan goreng legendaris dengan cita rasa gurih bawang goreng asli dan paduan kecap manis lezat. Praktis, cepat disajikan, dan favorit semua kalangan.',
        icon: 'restaurant-outline',
      },
      {
        id: 'P007',
        nama: 'Susu Kental Manis Frisian Flag 370g',
        kategori: 'Susu & Olahan',
        harga: 13000,
        stok: 42,
        satuan: 'kaleng',
        terjual: 26,
        barcode: '899100100707',
        supplier: 'PT Frisian Flag Indonesia',
        deskripsi: 'Susu kental manis gurih kaya kalsium dan vitamin. Cocok sebagai pelengkap roti tawar, kopi susu, es campur, martabak manis, dan kreasi hidangan penutup.',
        icon: 'cafe-outline',
      },
      {
        id: 'P008',
        nama: 'Garam Beryodium Daun 250g',
        kategori: 'Bumbu Dapur',
        harga: 3500,
        stok: 85,
        satuan: 'bungkus',
        terjual: 32,
        barcode: '899100100808',
        supplier: 'PT Susanti Megah Surabaya',
        deskripsi: 'Garam dapur halus beryodium tinggi untuk mendukung kesehatan keluarga dan mencegah penyakit gondok. Memberikan rasa asin gurih mantap pada masakan.',
        icon: 'flame-outline',
      },
      {
        id: 'P009',
        nama: 'Kecap Manis Bango Kedelai Hitam 275ml',
        kategori: 'Bumbu Dapur',
        harga: 18000,
        stok: 30,
        satuan: 'botol',
        terjual: 22,
        barcode: '899100100909',
        supplier: 'PT Unilever Indonesia Tbk',
        deskripsi: 'Kecap manis kental dari kedelai hitam Malika berkualitas pilihan dipadu gula kelapa alami. Menghadirkan warna cokelat mengkilap dan rasa manis gurih meresap sempurna.',
        icon: 'flask-outline',
      },
      {
        id: 'P010',
        nama: 'Bawang Merah Brebes Pilihan 500g',
        kategori: 'Bumbu Dapur',
        harga: 22000,
        stok: 25,
        satuan: 'pack',
        terjual: 19,
        barcode: '899100101010',
        supplier: 'Koperasi Tani Brebes Jaya',
        deskripsi: 'Bawang merah Brebes kering beraroma wangi tajam dan khas. Sangat cocok sebagai bumbu dasar aneka tumisan, sup, gulai, dan taburan bawang goreng renyah.',
        icon: 'leaf-outline',
      },
      {
        id: 'P011',
        nama: 'Bawang Putih Honan Segar 500g',
        kategori: 'Bumbu Dapur',
        harga: 20000,
        stok: 25,
        satuan: 'pack',
        terjual: 18,
        barcode: '899100101111',
        supplier: 'Distributor Rempah Nusantara',
        deskripsi: 'Bawang putih segar siung padat dan besar. Memberikan aroma wangi sedap dan rasa gurih alami untuk setiap olahan kuliner nusantara.',
        icon: 'leaf-outline',
      },
      {
        id: 'P012',
        nama: 'Kopi Kapal Api Spesial Mantap 165g',
        kategori: 'Minuman',
        harga: 14000,
        stok: 38,
        satuan: 'bungkus',
        terjual: 27,
        barcode: '899100101212',
        supplier: 'PT Santos Jaya Abadi',
        deskripsi: 'Kopi bubuk murni dari biji kopi pilihan dengan aroma kuat dan cita rasa mantap khas Kapal Api. Teman sejati mengawali hari penuh semangat.',
        icon: 'cafe-outline',
      },
    ];

    this.simpanKeStorage();
  }
}

export { Produk as ProdukService };
