const { STEM_YINYANG, stepPillar } = require("./ganzhi");
const { getSolarTermsByYear } = require("../adapters/manseryeok");

function calcDirection({ saju, input, ruleset }) {
  const rule = ruleset?.daeun?.directionRule || "yearStemYinYangByGender";
  const gender = input.gender;
  if (gender !== "M" && gender !== "F") throw new Error("gender must be 'M' or 'F'");

  if (rule === "yearStemYinYangByGender") {
    const yearStem = saju.pillars.year.stem;
    const yy = STEM_YINYANG[yearStem];
    const forward = (gender === "M") ? (yy === "양") : (yy === "음");
    return forward ? 1 : -1;
  }
  return 1;
}

function toDateTime(input) {
  return new Date(
    input.year,
    input.month - 1,
    input.day,
    input.hour ?? 0,
    input.minute ?? 0,
    0,
    0
  );
}

async function findNearestSolarTermDate({ birth, direction }) {
  const years = [birth.year - 1, birth.year, birth.year + 1];
  const termDates = [];

  for (const y of years) {
    const terms = await getSolarTermsByYear(y);
    for (const t of terms) {
      termDates.push({
        name: t.name,
        date: new Date(y, t.month - 1, t.day, t.hour, t.minute, 0, 0),
      });
    }
  }

  termDates.sort((a,b)=>a.date - b.date);
  const birthDt = toDateTime(birth);

  if (direction === 1) {
    return termDates.find(t => t.date > birthDt) || null;
  } else {
    for (let i = termDates.length - 1; i >= 0; i--) {
      if (termDates[i].date < birthDt) return termDates[i];
    }
    return null;
  }
}

function calcStartAge({ birth, nearestTerm, divisor }) {
  const birthDt = toDateTime(birth);
  const termDt = nearestTerm.date;

  const diffMs = Math.abs(termDt - birthDt);
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  const yearsFloat = diffDays / (divisor || 3);
  const years = Math.floor(yearsFloat);
  const monthsFloat = (yearsFloat - years) * 12;
  const months = Math.floor(monthsFloat);
  const days = Math.round((monthsFloat - months) * 30);

  return {
    yearsFloat,
    breakdown: { years, months, days },
    diffDays,
  };
}

async function calcDaeun({ saju, input, ruleset }) {
  const direction = calcDirection({ saju, input, ruleset });
  const nearestTerm = await findNearestSolarTermDate({ birth: input, direction });

  if (!nearestTerm) {
    return {
      direction,
      startAge: null,
      periods: [],
      warning: "절기 데이터 범위 밖이거나 nearestTerm를 찾지 못했습니다.",
    };
  }

  const divisor = ruleset?.daeun?.dayToYearDivisor ?? 3;
  const startAge = calcStartAge({ birth: input, nearestTerm, divisor });

  const baseMonthPillar = saju.pillars.month.text;
  const periodsCount = ruleset?.daeun?.periods ?? 10;
  const periodYears = ruleset?.daeun?.periodYears ?? 10;

  const periods = [];
  for (let i = 0; i < periodsCount; i++) {
    const pillar = stepPillar(baseMonthPillar, direction * (i + 1));
    const fromAge = startAge.yearsFloat + (i * periodYears);
    const toAge = fromAge + periodYears;

    periods.push({ index: i + 1, pillar, fromAge, toAge });
  }

  return { direction, nearestTerm, startAge, periods };
}

module.exports = { calcDaeun };
