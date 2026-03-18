"use strict";
const fs = require("fs");
const path = require("path");

const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, "../../../data");
const SUBS_FILE = path.join(DATA_DIR, "push-subscriptions.json");

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

function loadSubs() {
  ensureDataDir();
  if (!fs.existsSync(SUBS_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(SUBS_FILE, "utf8"));
  } catch {
    return [];
  }
}

function saveSubs(subs) {
  ensureDataDir();
  fs.writeFileSync(SUBS_FILE, JSON.stringify(subs, null, 2), "utf8");
}

function upsertSubscription(userId, subscription) {
  const subs = loadSubs();
  const idx = subs.findIndex((s) => s.userId === userId);
  const entry = { userId, subscription, updatedAt: new Date().toISOString() };
  if (idx >= 0) subs[idx] = entry;
  else subs.push(entry);
  saveSubs(subs);
}

function removeSubscription(userId) {
  const subs = loadSubs().filter((s) => s.userId !== userId);
  saveSubs(subs);
}

function getAllSubscriptions() {
  return loadSubs();
}

module.exports = { upsertSubscription, removeSubscription, getAllSubscriptions };
