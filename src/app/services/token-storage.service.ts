import { Injectable } from '@angular/core';

/**
 * Token storage abstraction.
 * - Reads synchronously from `localStorage` for compatibility with existing sync code (interceptor).
 * - Writes asynchronously to Capacitor Preferences (if available) and mirrors to `localStorage`.
 * - Safe fallback: if Capacitor Preferences isn't available, only `localStorage` is used.
 */
@Injectable({ providedIn: 'root' })
export class TokenStorageService {
  private readonly TOKEN_KEY = 'token';
  private readonly USERNAME_KEY = 'username';

  // Synchronous getters for compatibility
  getTokenSync(): string | null {
    try {
      return localStorage.getItem(this.TOKEN_KEY);
    } catch (e) {
      return null;
    }
  }

  getUsernameSync(): string | null {
    try {
      return localStorage.getItem(this.USERNAME_KEY);
    } catch (e) {
      return null;
    }
  }

  // Async getters that attempt to read from Capacitor Preferences first
  async getToken(): Promise<string | null> {
    try {
      const Preferences = (await import('@capacitor/preferences')).Preferences;
      const { value } = await Preferences.get({ key: this.TOKEN_KEY });
      if (value) return value;
    } catch (e) {
      // Capacitor Preferences not available or failed — fall back
    }
    return this.getTokenSync();
  }

  async setToken(token: string): Promise<void> {
    try {
      const Preferences = (await import('@capacitor/preferences')).Preferences;
      await Preferences.set({ key: this.TOKEN_KEY, value: token });
    } catch (e) {
      // ignore — fallback to localStorage below
    }

    try {
      localStorage.setItem(this.TOKEN_KEY, token);
    } catch (e) {
      // ignore localStorage failures
    }
  }

  async removeToken(): Promise<void> {
    try {
      const Preferences = (await import('@capacitor/preferences')).Preferences;
      await Preferences.remove({ key: this.TOKEN_KEY });
    } catch (e) {
      // ignore
    }

    try {
      localStorage.removeItem(this.TOKEN_KEY);
    } catch (e) {
      // ignore
    }
  }

  // Username helpers (mirror behavior)
  async setUsername(username: string): Promise<void> {
    try {
      const Preferences = (await import('@capacitor/preferences')).Preferences;
      await Preferences.set({ key: this.USERNAME_KEY, value: username });
    } catch (e) {
      // ignore
    }

    try {
      localStorage.setItem(this.USERNAME_KEY, username);
    } catch (e) {}
  }

  async removeUsername(): Promise<void> {
    try {
      const Preferences = (await import('@capacitor/preferences')).Preferences;
      await Preferences.remove({ key: this.USERNAME_KEY });
    } catch (e) {}

    try {
      localStorage.removeItem(this.USERNAME_KEY);
    } catch (e) {}
  }

  async logout(): Promise<void> {
    await this.removeToken();
    await this.removeUsername();
  }
}
