// SQLite Database Module for Functional AAC
// Powered by Node.js native SQLite engine (creates a real standard aac_database.sqlite file)
import { DatabaseSync } from 'node:sqlite';
import path from 'path';
import { fileURLToPath } from 'url';
import { INITIAL_SYSTEM_PHRASES, INITIAL_CUSTOM_PHRASES } from './js/data.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, 'aac_database.sqlite');

export const db = new DatabaseSync(DB_PATH);

// Initialize Tables
export function initDatabase() {
  // 1. Phrases Table (System Starter + Caregiver Custom Phrases)
  db.exec(`
    CREATE TABLE IF NOT EXISTS phrases (
      id TEXT PRIMARY KEY,
      text TEXT NOT NULL,
      category TEXT NOT NULL,
      ageGroup TEXT NOT NULL,
      priority TEXT NOT NULL,
      icon TEXT NOT NULL,
      enabled INTEGER NOT NULL DEFAULT 1,
      isCustom INTEGER NOT NULL DEFAULT 0,
      createdAt INTEGER,
      updatedAt INTEGER
    )
  `);

  // 2. Paired Hardware Device Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS paired_device (
      deviceId TEXT PRIMARY KEY,
      deviceName TEXT NOT NULL,
      ageGroup TEXT NOT NULL,
      pairedAt INTEGER,
      updatedAt INTEGER
    )
  `);

  // 3. Hardware Sync Logs Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS sync_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      syncId TEXT NOT NULL,
      phraseCount INTEGER NOT NULL,
      pendingCount INTEGER NOT NULL DEFAULT 0,
      syncedAt INTEGER NOT NULL
    )
  `);

  // Seed default phrases if table is empty
  const countRow = db.prepare('SELECT COUNT(*) as count FROM phrases').get();
  if (!countRow || countRow.count === 0) {
    seedDefaultData();
  } else {
    // Migration: ensure School phrases are strictly 'Children' and never 'All Ages'
    db.prepare(`UPDATE phrases SET ageGroup = 'Children' WHERE category = 'School' AND ageGroup = 'All Ages'`).run();
  }

  // Seed default paired device if empty
  const devRow = db.prepare('SELECT COUNT(*) as count FROM paired_device').get();
  if (!devRow || devRow.count === 0) {
    const insertDev = db.prepare(`
      INSERT INTO paired_device (deviceId, deviceName, ageGroup, pairedAt, updatedAt)
      VALUES (?, ?, ?, ?, ?)
    `);
    insertDev.run('AAC-PRO-8892', "Alex's Communicator Pro", 'Children', Date.now(), Date.now());
  }
}

// Seed Initial System & Custom Phrases
export function seedDefaultData() {
  const insertStmt = db.prepare(`
    INSERT OR REPLACE INTO phrases (id, text, category, ageGroup, priority, icon, enabled, isCustom, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  // Insert System Phrases
  for (const p of INITIAL_SYSTEM_PHRASES) {
    insertStmt.run(
      p.id,
      p.text,
      p.category,
      p.ageGroup || 'All Ages',
      p.priority || 'Normal',
      p.icon || 'chat',
      p.enabled ? 1 : 0,
      0, // isCustom = false
      p.createdAt || Date.now(),
      Date.now()
    );
  }

  // Insert Custom Phrases
  for (const p of INITIAL_CUSTOM_PHRASES) {
    insertStmt.run(
      p.id,
      p.text,
      p.category,
      p.ageGroup || 'Children',
      p.priority || 'Normal',
      p.icon || 'chat',
      p.enabled ? 1 : 0,
      1, // isCustom = true
      p.createdAt || Date.now(),
      Date.now()
    );
  }

  // Initial Sync Record
  db.prepare(`
    INSERT INTO sync_history (syncId, phraseCount, pendingCount, syncedAt)
    VALUES (?, ?, ?, ?)
  `).run('SYNC-INIT', INITIAL_SYSTEM_PHRASES.length + INITIAL_CUSTOM_PHRASES.length, 0, Date.now());
}

// --- Query & Mutation Methods ---

export function getAllPhrases() {
  const rows = db.prepare('SELECT * FROM phrases ORDER BY isCustom DESC, category ASC, id ASC').all();
  return rows.map(r => ({
    ...r,
    enabled: Boolean(r.enabled),
    isCustom: Boolean(r.isCustom)
  }));
}

export function getCustomPhrases() {
  const rows = db.prepare('SELECT * FROM phrases WHERE isCustom = 1 ORDER BY createdAt DESC').all();
  return rows.map(r => ({
    ...r,
    enabled: Boolean(r.enabled),
    isCustom: true
  }));
}

export function addCustomPhrase({ text, category, ageGroup, priority, icon, enabled = true }) {
  const id = 'cust_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4);
  const now = Date.now();
  
  db.prepare(`
    INSERT INTO phrases (id, text, category, ageGroup, priority, icon, enabled, isCustom, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?, ?)
  `).run(
    id,
    text.trim(),
    category,
    ageGroup || 'All Ages',
    priority || 'Normal',
    icon || 'chat',
    enabled ? 1 : 0,
    now,
    now
  );

  return {
    id,
    text: text.trim(),
    category,
    ageGroup: ageGroup || 'All Ages',
    priority: priority || 'Normal',
    icon: icon || 'chat',
    enabled: Boolean(enabled),
    isCustom: true,
    createdAt: now
  };
}

export function updatePhrase(id, fields) {
  const existing = db.prepare('SELECT * FROM phrases WHERE id = ?').get(id);
  if (!existing) return null;

  const updated = {
    text: fields.text !== undefined ? fields.text.trim() : existing.text,
    category: fields.category !== undefined ? fields.category : existing.category,
    ageGroup: fields.ageGroup !== undefined ? fields.ageGroup : existing.ageGroup,
    priority: fields.priority !== undefined ? fields.priority : existing.priority,
    icon: fields.icon !== undefined ? fields.icon : existing.icon,
    enabled: fields.enabled !== undefined ? (fields.enabled ? 1 : 0) : existing.enabled,
    updatedAt: Date.now()
  };

  db.prepare(`
    UPDATE phrases 
    SET text = ?, category = ?, ageGroup = ?, priority = ?, icon = ?, enabled = ?, updatedAt = ?
    WHERE id = ?
  `).run(
    updated.text,
    updated.category,
    updated.ageGroup,
    updated.priority,
    updated.icon,
    updated.enabled,
    updated.updatedAt,
    id
  );

  return {
    id,
    ...updated,
    enabled: Boolean(updated.enabled),
    isCustom: Boolean(existing.isCustom)
  };
}

export function deletePhrase(id) {
  const info = db.prepare('DELETE FROM phrases WHERE id = ?').run(id);
  return info.changes > 0;
}

export function togglePhrase(id) {
  const existing = db.prepare('SELECT * FROM phrases WHERE id = ?').get(id);
  if (!existing) return null;

  const nextEnabled = existing.enabled ? 0 : 1;
  db.prepare('UPDATE phrases SET enabled = ?, updatedAt = ? WHERE id = ?').run(nextEnabled, Date.now(), id);

  return {
    ...existing,
    enabled: Boolean(nextEnabled),
    isCustom: Boolean(existing.isCustom)
  };
}

export function setCategoryAll(category, enabled) {
  const intVal = enabled ? 1 : 0;
  db.prepare('UPDATE phrases SET enabled = ?, updatedAt = ? WHERE category = ?').run(intVal, Date.now(), category);
}

export function movePhraseCategory(id, newCategory) {
  db.prepare('UPDATE phrases SET category = ?, updatedAt = ? WHERE id = ?').run(newCategory, Date.now(), id);
}

export function getPairedDevice() {
  const row = db.prepare('SELECT * FROM paired_device LIMIT 1').get();
  return row || null;
}

export function savePairedDevice({ deviceId, deviceName, ageGroup }) {
  let cleanId = deviceId || 'AAC-PRO-8892';
  if (cleanId.startsWith('http://') || cleanId.startsWith('https://')) {
    try {
      const u = new URL(cleanId);
      const segments = u.pathname.split('/').filter(Boolean);
      cleanId = `QR-${(segments[segments.length - 1] || u.hostname).slice(0, 10).toUpperCase()}`;
    } catch (e) {
      cleanId = cleanId.slice(0, 14);
    }
  }

  db.exec('DELETE FROM paired_device');
  const now = Date.now();
  db.prepare(`
    INSERT INTO paired_device (deviceId, deviceName, ageGroup, pairedAt, updatedAt)
    VALUES (?, ?, ?, ?, ?)
  `).run(cleanId, deviceName || "Alex's Communicator Pro", ageGroup || 'Children', now, now);

  return {
    isPaired: true,
    deviceId: cleanId,
    deviceName: deviceName || "Alex's Communicator Pro",
    ageGroup: ageGroup || 'Children',
    pairedAt: now
  };
}

export function recordSync({ phraseCount = 0 }) {
  const syncId = 'SYNC-' + Math.random().toString(36).substring(2, 8).toUpperCase();
  const now = Date.now();
  db.prepare(`
    INSERT INTO sync_history (syncId, phraseCount, pendingCount, syncedAt)
    VALUES (?, ?, ?, ?)
  `).run(syncId, phraseCount, 0, now);

  return {
    needsSync: false,
    lastSynced: now,
    pendingChangesCount: 0,
    syncId
  };
}

export function getLatestSync() {
  const row = db.prepare('SELECT * FROM sync_history ORDER BY syncedAt DESC LIMIT 1').get();
  if (row) {
    return {
      needsSync: false,
      lastSynced: row.syncedAt,
      pendingChangesCount: 0,
      syncId: row.syncId
    };
  }
  return {
    needsSync: false,
    lastSynced: Date.now(),
    pendingChangesCount: 0,
    syncId: 'SYNC-INIT'
  };
}

export function resetAllToDefaults() {
  db.exec('DELETE FROM phrases');
  db.exec('DELETE FROM paired_device');
  db.exec('DELETE FROM sync_history');
  seedDefaultData();
  savePairedDevice({
    deviceId: 'AAC-PRO-8892',
    deviceName: "Alex's Communicator Pro",
    ageGroup: 'Children'
  });
}

// Auto-initialize when loaded
initDatabase();
