const { splitPillar } = require("../domain/ganzhi");

async function getLib() {
  return import("@fullstackfamily/manseryeok");
}

function normalizeSajuResult(sajuRaw) {
  const year = splitPillar(sajuRaw.yearPillar);
  const month = splitPillar(sajuRaw.monthPillar);
  const day = splitPillar(sajuRaw.dayPillar);
  const hour = splitPillar(sajuRaw.hourPillar);

  return {
    pillars: {
      year: { ...year, text: sajuRaw.yearPillar },
      month: { ...month, text: sajuRaw.monthPillar },
      day: { ...day, text: sajuRaw.dayPillar },
      hour: { ...hour, text: sajuRaw.hourPillar },
    },
    meta: {
      isTimeCorrected: !!sajuRaw.isTimeCorrected,
      correctedTime: sajuRaw.correctedTime || null,
    },
  };
}

async function calculateSajuSolar({ year, month, day, hour, minute, longitude, applyTimeCorrection }) {
  const lib = await getLib();
  const sajuRaw = lib.calculateSaju(year, month, day, hour ?? 0, minute ?? 0, {
    longitude: typeof longitude === "number" ? longitude : 127,
    applyTimeCorrection: applyTimeCorrection !== false,
  });
  return normalizeSajuResult(sajuRaw);
}

async function getSolarTermsByYear(year) {
  const lib = await getLib();
  return lib.getSolarTermsByYear(year);
}

module.exports = {
  calculateSajuSolar,
  getSolarTermsByYear,
};
