const router = require("express").Router();
const { calcAll } = require("@fortune/engine");
const ruleset = require("@fortune/engine/src/rulesets/standard.kr");

router.post("/calc", async (req, res) => {
  try {
    const input = req.body || {};
    const result = await calcAll(input, ruleset);
    res.json({ ok: true, result });
  } catch (e) {
    res.status(400).json({ ok: false, error: String(e?.message || e) });
  }
});

module.exports = router;
