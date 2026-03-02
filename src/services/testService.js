import { seedTests } from "../data/seed";

const STORAGE_KEY = "dna_tests_v1";

// --- Helpers ---
function normalizeContact(value) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

function ensureSeeded() {
  const existing = localStorage.getItem(STORAGE_KEY);
  if (!existing) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seedTests));
  }
}

function readAll() {
  ensureSeeded();
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
}

function writeAll(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

// --- Tracking ID Generator ---
const CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
// Removed confusing chars like O/0 and I/1

function randomString(length = 7) {
  let out = "";
  for (let i = 0; i < length; i++) {
    out += CHARS[Math.floor(Math.random() * CHARS.length)];
  }
  return out;
}

function generateTrackingId() {
  return `DNA-${randomString(7)}`;
}

// Generates a unique ID by checking existing storage
export function generateUniqueTrackingId() {
  const all = readAll();
  const existing = new Set(all.map((t) => t.trackingId.toLowerCase()));

  let id = generateTrackingId();
  while (existing.has(id.toLowerCase())) {
    id = generateTrackingId();
  }
  return id;
}

// --- CRUD ---
export function listTests() {
  return readAll().sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
}

export function findTestByTrackingId(trackingId) {
  const all = readAll();
  const id = String(trackingId || "")
    .trim()
    .toLowerCase();
  return all.find((t) => t.trackingId.toLowerCase() === id) || null;
}

// This is what the public tracking page uses
export function trackLookup(trackingId, contact) {
  const test = findTestByTrackingId(trackingId);
  if (!test) return { ok: false, error: "Tracking ID not found." };

  const input = normalizeContact(contact);
  const saved = normalizeContact(test.contact);

  if (input !== saved)
    return { ok: false, error: "Details do not match our records." };

  return { ok: true, test };
}

export function createTest(payload) {
  const all = readAll();

  const newTest = {
    trackingId: payload.trackingId || generateUniqueTrackingId(),
    contact: normalizeContact(payload.contact),
    clientType: payload.clientType || "walkin",
    sampleStatus: payload.sampleStatus || "pending",
    labStatus: payload.labStatus || "queued",
    resultStatus: payload.resultStatus || "not_ready",
    deliveryMethod: payload.deliveryMethod || "pickup",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  all.unshift(newTest);
  writeAll(all);

  return { ok: true, test: newTest };
}

export function updateTest(trackingId, updates) {
  const all = readAll();
  const id = String(trackingId || "")
    .trim()
    .toLowerCase();

  const idx = all.findIndex((t) => t.trackingId.toLowerCase() === id);
  if (idx === -1) return { ok: false, error: "Test not found." };

  all[idx] = {
    ...all[idx],
    ...updates,
    contact: updates.contact
      ? normalizeContact(updates.contact)
      : all[idx].contact,
    updatedAt: Date.now(),
  };

  writeAll(all);
  return { ok: true, test: all[idx] };
}

export function resetTests() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(seedTests));
  return { ok: true };
}
