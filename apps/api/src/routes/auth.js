"use strict";
const router = require("express").Router();
const rateLimit = require("express-rate-limit");
const { createUser, verifyUser } = require("../lib/users");
const { signToken } = require("../lib/auth");

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, error: "요청이 너무 많습니다. 15분 후 다시 시도해 주세요." },
});

router.post("/register", authLimiter, async (req, res) => {
  try {
    const { email, password, name } = req.body || {};
    if (!email || !password) throw new Error("이메일과 비밀번호를 입력하세요.");
    if (password.length < 6) throw new Error("비밀번호는 최소 6자 이상이어야 합니다.");
    const user = await createUser({ email, password, name });
    const token = signToken({ id: user.id, email: user.email, name: user.name });
    res.json({ ok: true, token, user });
  } catch (e) {
    res.status(400).json({ ok: false, error: String(e?.message || e) });
  }
});

router.post("/login", authLimiter, async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) throw new Error("이메일과 비밀번호를 입력하세요.");
    const user = await verifyUser({ email, password });
    const token = signToken({ id: user.id, email: user.email, name: user.name });
    res.json({ ok: true, token, user });
  } catch (e) {
    res.status(400).json({ ok: false, error: String(e?.message || e) });
  }
});

router.get("/me", authLimiter, require("../lib/auth").authMiddleware, (req, res) => {
  res.json({ ok: true, user: req.user });
});

module.exports = router;
