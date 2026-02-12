const HAP = [
  ["자","축"], ["인","해"], ["묘","술"], ["진","유"], ["사","신"], ["오","미"],
];
const CHUNG = [
  ["자","오"], ["축","미"], ["인","신"], ["묘","유"], ["진","술"], ["사","해"],
];
const HAE = [
  ["자","미"], ["축","오"], ["인","사"], ["묘","진"], ["신","해"], ["유","술"],
];
const PA = [
  ["자","유"], ["축","진"], ["인","해"], ["묘","오"], ["사","신"], ["미","술"],
];

function hasPair(table, a, b) {
  return table.some(([x,y]) => (x===a && y===b) || (x===b && y===a));
}

function detectBranchRelations(branchesA, branchesB) {
  const res = { hap:[], chung:[], hae:[], pa:[] };
  for (const a of branchesA) {
    for (const b of branchesB) {
      if (hasPair(HAP, a, b)) res.hap.push([a,b]);
      if (hasPair(CHUNG, a, b)) res.chung.push([a,b]);
      if (hasPair(HAE, a, b)) res.hae.push([a,b]);
      if (hasPair(PA, a, b)) res.pa.push([a,b]);
    }
  }
  return res;
}

function scoreGunghap(rel) {
  const s = (rel.hap.length * 5)
          + (rel.chung.length * -6)
          + (rel.hae.length * -3)
          + (rel.pa.length * -4);
  const base = 60;
  return Math.max(0, Math.min(100, base + s));
}

function buildSummary(score, rel) {
  const good = rel.hap.length;
  const bad = rel.chung.length + rel.pa.length + rel.hae.length;
  if (score >= 75) return `궁합 점수 ${score}점: 조화로운 편(합 ${good} / 충·해·파 ${bad}).`;
  if (score >= 55) return `궁합 점수 ${score}점: 무난(합 ${good} / 충·해·파 ${bad}).`;
  return `궁합 점수 ${score}점: 갈등 포인트 주의(합 ${good} / 충·해·파 ${bad}).`;
}

function compareGunghap(sajuA, sajuB) {
  const a = sajuA.pillars;
  const b = sajuB.pillars;

  const branchesA = [a.year.branch, a.month.branch, a.day.branch, a.hour.branch];
  const branchesB = [b.year.branch, b.month.branch, b.day.branch, b.hour.branch];

  const rel = detectBranchRelations(branchesA, branchesB);
  const score = scoreGunghap(rel);

  return { score, relations: rel, summary: buildSummary(score, rel) };
}

module.exports = { compareGunghap };
