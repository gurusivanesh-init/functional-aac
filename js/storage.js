// LocalStorage & SQLite Database Bridge for Functional AAC System
// Dual-layer storage: Instant local cache (0ms offline latency) + SQLite backend persistence
import { INITIAL_SYSTEM_PHRASES, INITIAL_CUSTOM_PHRASES } from './data.js';

const STORAGE_KEY_SYSTEM = 'aac_system_phrases_v1';
const STORAGE_KEY_CUSTOM = 'aac_custom_phrases_v1';
const STORAGE_KEY_SYNC_INFO = 'aac_sync_info_v1';
const STORAGE_KEY_SETTINGS = 'aac_device_settings_v1';
const STORAGE_KEY_PAIRING = 'aac_device_pairing_v1';

export class StorageService {
  constructor() {
    this.listeners = [];
    this.isSqliteConnected = false;
    this.databaseName = 'aac_database.sqlite';

    // Probe SQLite Backend API
    this.initSqliteBridge();
  }

  async initSqliteBridge() {
    if (typeof window === 'undefined' || !window.fetch) return;
    try {
      const res = await fetch('/api/status', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        this.isSqliteConnected = true;
        this.databaseName = data.databaseFile || 'aac_database.sqlite';
        console.log('✓ Connected to SQLite database:', this.databaseName);

        // Synchronize local cache with SQLite database
        await this.pullFromSqlite();
      }
    } catch (e) {
      console.log('ℹ SQLite server offline or running locally offline. Operating in LocalStorage mode.');
      this.isSqliteConnected = false;
    }
  }

  async pullFromSqlite() {
    try {
      const res = await fetch('/api/phrases', { cache: 'no-store' });
      if (res.ok) {
        const allPhrases = await res.json();
        const system = allPhrases.filter(p => !p.isCustom);
        const custom = allPhrases.filter(p => p.isCustom);

        if (system.length > 0) this.saveSystemPhrases(system);
        if (custom.length > 0) this.saveCustomPhrases(custom);

        // Also fetch paired device info from SQLite
        const devRes = await fetch('/api/device', { cache: 'no-store' });
        if (devRes.ok) {
          const devData = await devRes.json();
          if (devData && devData.device) {
            localStorage.setItem(STORAGE_KEY_PAIRING, JSON.stringify({
              isPaired: true,
              deviceId: devData.device.deviceId,
              deviceName: devData.device.deviceName,
              ageGroup: devData.device.ageGroup,
              pairedAt: devData.device.pairedAt
            }));
          }
        }

        this.notify();
      }
    } catch (err) {
      console.warn('Could not pull from SQLite, using local cache:', err);
    }
  }

  getPairedDevice() {
    try {
      const data = localStorage.getItem(STORAGE_KEY_PAIRING);
      if (data) {
        const parsed = JSON.parse(data);
        if (parsed.deviceId && (parsed.deviceId.startsWith('http://') || parsed.deviceId.startsWith('https://'))) {
          try {
            const u = new URL(parsed.deviceId);
            const segments = u.pathname.split('/').filter(Boolean);
            const code = segments[segments.length - 1] || u.hostname;
            parsed.deviceId = `QR-${code.slice(0, 10).toUpperCase()}`;
            localStorage.setItem(STORAGE_KEY_PAIRING, JSON.stringify(parsed));
          } catch (e) {}
        }
        return parsed;
      }
    } catch (e) {}
    return null;
  }

  savePairedDevice(deviceInfo) {
    let rawId = deviceInfo.deviceId || 'AAC-PRO-8892';
    if (rawId.startsWith('http://') || rawId.startsWith('https://')) {
      try {
        const u = new URL(rawId);
        const segments = u.pathname.split('/').filter(Boolean);
        const code = segments[segments.length - 1] || u.hostname;
        rawId = `QR-${code.slice(0, 10).toUpperCase()}`;
      } catch (e) {
        rawId = rawId.slice(0, 14);
      }
    }

    const payload = {
      isPaired: true,
      deviceId: rawId,
      deviceName: deviceInfo.deviceName || "Alex's Communicator Pro",
      ageGroup: deviceInfo.ageGroup || 'Children',
      pairedAt: Date.now()
    };
    localStorage.setItem(STORAGE_KEY_PAIRING, JSON.stringify(payload));
    this.notify();

    // Async commit to SQLite
    this.apiPost('/api/device', payload);
    return payload;
  }

  updateAgeGroup(newAgeGroup) {
    const current = this.getPairedDevice() || {
      isPaired: true,
      deviceId: 'AAC-PRO-8892',
      deviceName: "Alex's Communicator Pro"
    };
    current.ageGroup = newAgeGroup;
    current.updatedAt = Date.now();
    localStorage.setItem(STORAGE_KEY_PAIRING, JSON.stringify(current));
    this.notify();

    // Async commit to SQLite
    this.apiPost('/api/device', current);
    return current;
  }

  unpairDevice() {
    localStorage.removeItem(STORAGE_KEY_PAIRING);
    this.notify();
  }

  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  notify() {
    this.markSyncNeeded();
    this.listeners.forEach(cb => {
      try {
        cb();
      } catch (e) {
        console.error('Listener callback failed:', e);
      }
    });
  }

  getSystemPhrases() {
    try {
      const data = localStorage.getItem(STORAGE_KEY_SYSTEM);
      if (!data) {
        this.saveSystemPhrases(INITIAL_SYSTEM_PHRASES);
        return [...INITIAL_SYSTEM_PHRASES];
      }
      const parsed = JSON.parse(data);
      let migrated = false;
      parsed.forEach(p => {
        if (p.category === 'School' && p.ageGroup === 'All Ages') {
          p.ageGroup = 'Children';
          migrated = true;
        }
      });
      if (migrated) {
        this.saveSystemPhrases(parsed);
      }
      return parsed;
    } catch (e) {
      console.warn('Failed to parse system phrases, using defaults', e);
      return [...INITIAL_SYSTEM_PHRASES];
    }
  }

  saveSystemPhrases(phrases) {
    localStorage.setItem(STORAGE_KEY_SYSTEM, JSON.stringify(phrases));
  }

  getCustomPhrases() {
    try {
      const data = localStorage.getItem(STORAGE_KEY_CUSTOM);
      if (!data) {
        this.saveCustomPhrases(INITIAL_CUSTOM_PHRASES);
        return [...INITIAL_CUSTOM_PHRASES];
      }
      return JSON.parse(data);
    } catch (e) {
      console.warn('Failed to parse custom phrases, using defaults', e);
      return [...INITIAL_CUSTOM_PHRASES];
    }
  }

  saveCustomPhrases(phrases) {
    localStorage.setItem(STORAGE_KEY_CUSTOM, JSON.stringify(phrases));
  }

  getAllPhrases() {
    const sys = this.getSystemPhrases();
    const cust = this.getCustomPhrases();
    return [...sys, ...cust];
  }

  addCustomPhrase({ text, category, ageGroup, priority, icon, enabled = true }) {
    const customPhrases = this.getCustomPhrases();
    const newPhrase = {
      id: 'cust_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      text: text.trim(),
      category,
      ageGroup: ageGroup || 'All Ages',
      priority: priority || 'Normal',
      icon: icon || 'chat',
      enabled: Boolean(enabled),
      isCustom: true,
      createdAt: Date.now()
    };
    customPhrases.unshift(newPhrase);
    this.saveCustomPhrases(customPhrases);
    this.notify();

    // Async commit to SQLite
    this.apiPost('/api/phrases', newPhrase);
    return newPhrase;
  }

  updateCustomPhrase(id, fields) {
    const customPhrases = this.getCustomPhrases();
    const index = customPhrases.findIndex(p => p.id === id);
    if (index === -1) return null;

    customPhrases[index] = {
      ...customPhrases[index],
      ...fields,
      updatedAt: Date.now()
    };
    this.saveCustomPhrases(customPhrases);
    this.notify();

    // Async commit to SQLite
    this.apiPut(`/api/phrases/${encodeURIComponent(id)}`, fields);
    return customPhrases[index];
  }

  deleteCustomPhrase(id) {
    let customPhrases = this.getCustomPhrases();
    const target = customPhrases.find(p => p.id === id);
    if (!target) return false;

    customPhrases = customPhrases.filter(p => p.id !== id);
    this.saveCustomPhrases(customPhrases);
    this.notify();

    // Async commit to SQLite
    this.apiDelete(`/api/phrases/${encodeURIComponent(id)}`);
    return true;
  }

  togglePhrase(id) {
    // Check if custom
    const customPhrases = this.getCustomPhrases();
    const custIndex = customPhrases.findIndex(p => p.id === id);
    if (custIndex !== -1) {
      customPhrases[custIndex].enabled = !customPhrases[custIndex].enabled;
      this.saveCustomPhrases(customPhrases);
      this.notify();
      this.apiPost('/api/phrases/toggle', { id });
      return customPhrases[custIndex];
    }

    // Check if system
    const systemPhrases = this.getSystemPhrases();
    const sysIndex = systemPhrases.findIndex(p => p.id === id);
    if (sysIndex !== -1) {
      systemPhrases[sysIndex].enabled = !systemPhrases[sysIndex].enabled;
      this.saveSystemPhrases(systemPhrases);
      this.notify();
      this.apiPost('/api/phrases/toggle', { id });
      return systemPhrases[sysIndex];
    }
    return null;
  }

  setCategoryAll(category, enabled) {
    const sys = this.getSystemPhrases().map(p => {
      if (p.category === category) return { ...p, enabled };
      return p;
    });
    this.saveSystemPhrases(sys);

    const cust = this.getCustomPhrases().map(p => {
      if (p.category === category) return { ...p, enabled };
      return p;
    });
    this.saveCustomPhrases(cust);

    this.notify();
    this.apiPost('/api/phrases/category-toggle', { category, enabled });
  }

  movePhraseCategory(id, newCategory) {
    const customPhrases = this.getCustomPhrases();
    const index = customPhrases.findIndex(p => p.id === id);
    if (index !== -1) {
      customPhrases[index].category = newCategory;
      customPhrases[index].updatedAt = Date.now();
      this.saveCustomPhrases(customPhrases);
      this.notify();
      this.apiPost('/api/phrases/move', { id, category: newCategory });
      return true;
    }
    return false;
  }

  getDeviceConfiguration() {
    const all = this.getAllPhrases();
    const enabled = all.filter(p => p.enabled);
    return {
      version: '2.4.0',
      deviceId: 'AAC-PRO-8892',
      deviceName: "Alex's Communicator Pro",
      syncedAt: this.getSyncInfo().lastSynced,
      phraseCount: enabled.length,
      phrases: enabled,
      settings: this.getSettings()
    };
  }

  getSettings() {
    try {
      const d = localStorage.getItem(STORAGE_KEY_SETTINGS);
      if (d) return JSON.parse(d);
    } catch(e) {}
    return {
      voicePitch: 1.0,
      voiceRate: 0.95,
      voiceGender: 'neutral',
      gridSize: '3x3',
      highContrast: false,
      soundHaptics: true,
      speechVolume: 1.0,
      activeDeviceCategory: 'Home'
    };
  }

  saveSettings(settings) {
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
    this.notify();
  }

  markSyncNeeded() {
    const info = this.getSyncInfo();
    info.needsSync = true;
    info.pendingChangesCount = (info.pendingChangesCount || 0) + 1;
    localStorage.setItem(STORAGE_KEY_SYNC_INFO, JSON.stringify(info));
  }

  recordSyncSuccess() {
    const all = this.getAllPhrases();
    const enabled = all.filter(p => p.enabled);
    const syncId = 'SYNC-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    const now = Date.now();

    const info = {
      needsSync: false,
      lastSynced: now,
      pendingChangesCount: 0,
      syncId
    };
    localStorage.setItem(STORAGE_KEY_SYNC_INFO, JSON.stringify(info));
    this.notify();

    // Commit sync transaction to SQLite
    this.apiPost('/api/sync', {
      syncId,
      phraseCount: enabled.length,
      syncedAt: now
    });

    return info;
  }

  getSyncInfo() {
    try {
      const d = localStorage.getItem(STORAGE_KEY_SYNC_INFO);
      if (d) return JSON.parse(d);
    } catch (e) {}
    return {
      needsSync: false,
      lastSynced: Date.now() - 3600000 * 2,
      pendingChangesCount: 0,
      syncId: 'SYNC-INIT'
    };
  }

  resetAll() {
    localStorage.removeItem(STORAGE_KEY_SYSTEM);
    localStorage.removeItem(STORAGE_KEY_CUSTOM);
    localStorage.removeItem(STORAGE_KEY_SYNC_INFO);
    localStorage.removeItem(STORAGE_KEY_SETTINGS);
    this.saveSystemPhrases(INITIAL_SYSTEM_PHRASES);
    this.saveCustomPhrases(INITIAL_CUSTOM_PHRASES);
    this.recordSyncSuccess();
    this.notify();

    // Async reset in SQLite
    this.apiPost('/api/reset', {});
  }

  exportJson() {
    const payload = {
      app: 'Functional AAC Communication Suite',
      version: '2.4.0',
      database: 'SQLite (aac_database.sqlite)',
      exportedAt: new Date().toISOString(),
      systemPhrases: this.getSystemPhrases(),
      customPhrases: this.getCustomPhrases(),
      settings: this.getSettings()
    };
    return JSON.stringify(payload, null, 2);
  }

  importJson(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      if (!Array.isArray(data.customPhrases) && !Array.isArray(data.systemPhrases)) {
        throw new Error('Invalid AAC backup file format: missing phrases');
      }
      if (Array.isArray(data.systemPhrases)) {
        this.saveSystemPhrases(data.systemPhrases);
      }
      if (Array.isArray(data.customPhrases)) {
        this.saveCustomPhrases(data.customPhrases);
      }
      if (data.settings) {
        this.saveSettings(data.settings);
      }
      this.markSyncNeeded();
      this.notify();
      return true;
    } catch (err) {
      console.error('Import error:', err);
      throw err;
    }
  }

  // --- Network API Helpers ---
  async apiPost(url, body) {
    try {
      await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
    } catch (e) {}
  }

  async apiPut(url, body) {
    try {
      await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
    } catch (e) {}
  }

  async apiDelete(url) {
    try {
      await fetch(url, { method: 'DELETE' });
    } catch (e) {}
  }
}

export const storage = new StorageService();
