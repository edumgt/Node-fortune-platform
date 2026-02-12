function elementSummary(elements) {
  const { dominant, weak } = elements;
  return `오행은 ${dominant.element} 기운이 상대적으로 강하고, ${weak.element} 기운이 약한 편입니다.`;
}

function tenGodSummary(tenGods) {
  const { map } = tenGods;
  return `일간 기준으로 연간=${map.year}, 월간=${map.month}, 시간=${map.hour} 흐름이 잡힙니다.`;
}

function daeunSummary(daeun) {
  if (!daeun?.startAge) return `대운 계산은 절기 데이터 범위/규칙 설정을 확인해야 합니다.`;
  const b = daeun.startAge.breakdown;
  const dir = daeun.direction === 1 ? "순행" : "역행";
  const first = daeun.periods?.[0]?.pillar ? `첫 대운은 ${daeun.periods[0].pillar}부터 시작합니다.` : "";
  return `대운은 ${dir} 기준, 약 ${b.years}년 ${b.months}개월 즈음 시작하는 것으로 계산됩니다. ${first}`.trim();
}

function overallSummary({ elements, tenGods, daeun }) {
  return [elementSummary(elements), tenGodSummary(tenGods), daeunSummary(daeun)].join("\n");
}

module.exports = { overallSummary };
