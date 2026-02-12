const router = require("express").Router();
const { calcAll, compareGunghap } = require("@fortune/engine");
const ruleset = require("@fortune/engine/src/rulesets/standard.kr");

router.post("/", async (req, res) => {
  try {
    const body = req.body || {};
    const aInput = body.a;
    const bInput = body.b;
    if (!aInput || !bInput) throw new Error("payload must include { a: {...}, b: {...} }");

    const a = await calcAll(aInput, ruleset);
    const b = await calcAll(bInput, ruleset);

    const gunghap = compareGunghap(a.saju, b.saju);
    res.json({ ok: true, a, b, gunghap });
  } catch (e) {
    res.status(400).json({ ok: false, error: String(e?.message || e) });
  }
});

module.exports = router;
