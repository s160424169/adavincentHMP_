import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicModule } from '@ionic/angular/lazy';
import { DashboardPage } from './dashboard.page';
import { Produk } from '../services/produk';
import { Transaksi } from '../services/transaksi';

describe('DashboardPage', () => {
  let component: DashboardPage;
  let fixture: ComponentFixture<DashboardPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DashboardPage],
      imports: [IonicModule.forRoot()],
      providers: [Produk, Transaksi],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load ringkasan from service on init', () => {
    expect(component.jumlahProduk).toBeGreaterThan(0);
    expect(component.totalTransaksiHariIni).toBeGreaterThanOrEqual(0);
    expect(component.produkTerlaris).toBeTruthy();
  });

  it('should format rupiah correctly', () => {
    const hasil = component.formatRupiah(50000);
    expect(hasil).toContain('50.000');
  });

  it('should render interpolation bindings in template', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain(component.jumlahProduk.toString());
    expect(compiled.textContent).toContain(component.totalTransaksiHariIni.toString());
    expect(compiled.textContent).toContain(component.produkTerlaris);
  });
});
