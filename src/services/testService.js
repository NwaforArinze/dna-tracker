import { seedTests } from "../data/seed";

const STORAGE_KEY = "dna_tests_v1";

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
export function trackLookup(trackingId, serialNumber) {
  const tests = readAll();

  const test = tests.find(
    (t) =>
      t.trackingId.toLowerCase() === trackingId.toLowerCase() &&
      t.serialNumber?.toLowerCase() === serialNumber.toLowerCase(),
  );

  if (!test) {
    return { ok: false, error: "Invalid Tracking ID or Serial Number" };
  }

  return { ok: true, test };
}

export function createTest(payload) {
  const all = readAll();

  const newTest = {
    trackingId: payload.trackingId || generateUniqueTrackingId(),
    contact: normalizeContact(payload.contact),
    scenario: payload.scenario || "walkin",
    currentStep: 0,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  all.unshift(newTest);
  writeAll(all);

  return { ok: true, test: newTest };
}

export function updateTest(trackingId, updates) {
  const all = readAll();

  const idx = all.findIndex((t) => t.trackingId === trackingId);
  if (idx === -1) return { ok: false };

  const existing = all[idx];

  // clone timestamps array safely
  let stepTimestamps = existing.stepTimestamps || [];

  // detect step change
  if (
    updates.currentStep !== undefined &&
    updates.currentStep > existing.currentStep
  ) {
    const stepIndex = updates.currentStep;

    // ensure array length
    if (!stepTimestamps.length) {
      stepTimestamps = [];
    }

    // record timestamp for that step
    stepTimestamps[stepIndex] = Date.now();
  }

  all[idx] = {
    ...existing,
    ...updates,
    stepTimestamps,
    updatedAt: Date.now(),
  };

  writeAll(all);

  return { ok: true, test: all[idx] };
}

export function resetTests() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(seedTests));
  return { ok: true };
}
