const { STEM_ELEMENT } = require("./ganzhi");

const GEN = { "목":"화","화":"토","토":"금","금":"수","수":"목" };
const KILL = { "목":"토","토":"수","수":"화","화":"금","금":"목" };

function tenGodByElement(dayStem, otherStem) {
  const me = STEM_ELEMENT[dayStem];
  const other = STEM_ELEMENT[otherStem];

  if (other === me) return "비견/겁재";
  if (GEN[me] === other) return "식신/상관";
  if (GEN[other] === me) return "인성";
  if (KILL[me] === other) return "재성";
  if (KILL[other] === me) return "관성";
  return "기타";
}

function deriveTenGods(saju) {
  const dayStem = saju.pillars.day.stem;
  return {
    dayStem,
    map: {
      year: tenGodByElement(dayStem, saju.pillars.year.stem),
      month: tenGodByElement(dayStem, saju.pillars.month.stem),
      hour: tenGodByElement(dayStem, saju.pillars.hour.stem),
    },
  };
}

module.exports = { deriveTenGods };
