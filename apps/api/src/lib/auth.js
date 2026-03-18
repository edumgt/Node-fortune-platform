"use strict";
const jwt = require("jsonwebtoken");

const SECRET = process.env.JWT_SECRET || "fortune-dev-secret-change-in-production";
const EXPIRES = "7d";

if (!process.env.JWT_SECRET && process.env.NODE_ENV === "production") {
  console.warn("[auth] WARNING: JWT_SECRET is not set. Using insecure default. Set JWT_SECRET environment variable in production.");
}

function signToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: EXPIRES });
}

function verifyToken(token) {
  return jwt.verify(token, SECRET);
}

function authMiddleware(req, res, next) {
  const header = req.headers["authorization"] || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ ok: false, error: "인증이 필요합니다." });
  try {
    req.user = verifyToken(token);
    next();
  } catch {
    return res.status(401).json({ ok: false, error: "토큰이 유효하지 않습니다." });
  }
}

module.exports = { signToken, verifyToken, authMiddleware };
