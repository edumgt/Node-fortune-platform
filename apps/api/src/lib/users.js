"use strict";
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");

const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, "../../../data");
const USERS_FILE = path.join(DATA_DIR, "users.json");

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

function loadUsers() {
  ensureDataDir();
  if (!fs.existsSync(USERS_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(USERS_FILE, "utf8"));
  } catch {
    return [];
  }
}

function saveUsers(users) {
  ensureDataDir();
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), "utf8");
}

function findByEmail(email) {
  return loadUsers().find((u) => u.email === email.toLowerCase()) || null;
}

async function createUser({ email, password, name }) {
  const users = loadUsers();
  const exists = users.find((u) => u.email === email.toLowerCase());
  if (exists) throw new Error("이미 사용 중인 이메일입니다.");
  const hash = await bcrypt.hash(password, 10);
  const user = {
    id: `u_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    email: email.toLowerCase(),
    name: name || email.split("@")[0],
    passwordHash: hash,
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  saveUsers(users);
  return { id: user.id, email: user.email, name: user.name };
}

async function verifyUser({ email, password }) {
  const user = findByEmail(email);
  if (!user) throw new Error("이메일 또는 비밀번호가 올바르지 않습니다.");
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) throw new Error("이메일 또는 비밀번호가 올바르지 않습니다.");
  return { id: user.id, email: user.email, name: user.name };
}

/** Seed test accounts once on startup */
async function seedTestAccounts() {
  const tests = [
    { email: "test1@test.com", password: "123456", name: "테스트1" },
    { email: "test2@test.com", password: "123456", name: "테스트2" },
  ];
  for (const t of tests) {
    if (!findByEmail(t.email)) {
      await createUser(t);
      console.log(`[seed] Created test account: ${t.email}`);
    }
  }
}

module.exports = { createUser, verifyUser, seedTestAccounts };
