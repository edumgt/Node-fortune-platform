"use strict";
const router = require("express").Router();
const { calcDailyFortune } = require("@fortune/engine");
const { calcAll } = require("@fortune/engine");
const ruleset = require("@fortune/engine/src/rulesets/standard.kr");

/** GET /api/daily - get today's fortune (no auth required, or pass birth info) */
router.post("/", async (req, res) => {
  try {
    const input = req.body || {};
    let userSaju = null;

    if (input.year && input.month && input.day) {
      const full = await calcAll(input, ruleset);
      userSaju = full.saju;
    }

    const daily = await calcDailyFortune({ userSaju, birthInput: input });
    res.json({ ok: true, daily });
  } catch (e) {
    res.status(400).json({ ok: false, error: String(e?.message || e) });
  }
});

/** GET /api/daily/today-ganzhi - get today's ganzhi without user data */
router.get("/today-ganzhi", async (req, res) => {
  try {
    const daily = await calcDailyFortune({ userSaju: null });
    res.json({ ok: true, daily });
  } catch (e) {
    res.status(400).json({ ok: false, error: String(e?.message || e) });
  }
});

module.exports = router;
