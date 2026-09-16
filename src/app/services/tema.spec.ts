// @vitest-environment jsdom

import { beforeEach, describe, expect, it } from 'vitest';
import { Tema } from './tema';

describe('Tema', () => {
  let service: Tema;

  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('ion-palette-dark');
    service = new Tema();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should toggle dark mode and persist the preference', () => {
    service.toggleModeGelap(true);

    expect(service.isDarkMode).toBe(true);
    expect(localStorage.getItem('simobile-mode-gelap')).toBe('1');
    expect(document.documentElement.classList.contains('ion-palette-dark')).toBe(true);

    service.toggleModeGelap(false);

    expect(service.isDarkMode).toBe(false);
    expect(localStorage.getItem('simobile-mode-gelap')).toBe('0');
    expect(document.documentElement.classList.contains('ion-palette-dark')).toBe(false);
  });

  it('should emit dark mode state changes through the observable', () => {
    let latestValue: boolean | undefined;

    service.darkMode$.subscribe((value) => {
      latestValue = value;
    });

    service.toggleModeGelap(true);

    expect(latestValue).toBe(true);
  });
});
