const { calculateSajuSolar } = require("./adapters/manseryeok");
const { deriveElements } = require("./domain/elements");
const { deriveTenGods } = require("./domain/tenGods");
const { calcDaeun } = require("./domain/daeun");
const { compareGunghap } = require("./domain/relations");
const { interpretSaju } = require("./domain/interpret/scorer");
const { calcDailyFortune } = require("./domain/daily");

async function calcAll(input, ruleset) {
  const saju = await calculateSajuSolar(input);
  const elements = deriveElements(saju);
  const tenGods = deriveTenGods(saju);
  const daeun = await calcDaeun({ saju, input, ruleset });
  const reading = interpretSaju({ elements, tenGods, daeun, ruleset });
  return { saju, elements, tenGods, daeun, reading };
}

module.exports = { calcAll, compareGunghap, calcDailyFortune };
