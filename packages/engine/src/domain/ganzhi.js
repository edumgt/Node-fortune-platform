const STEMS = ["갑","을","병","정","무","기","경","신","임","계"];
const BRANCHES = ["자","축","인","묘","진","사","오","미","신","유","술","해"];

const STEM_YINYANG = {
  "갑":"양","을":"음","병":"양","정":"음","무":"양","기":"음","경":"양","신":"음","임":"양","계":"음",
};

const STEM_ELEMENT = {
  "갑":"목","을":"목",
  "병":"화","정":"화",
  "무":"토","기":"토",
  "경":"금","신":"금",
  "임":"수","계":"수",
};

// (간단 버전) 지지 오행
const BRANCH_ELEMENT = {
  "자":"수","축":"토","인":"목","묘":"목","진":"토","사":"화","오":"화","미":"토","신":"금","유":"금","술":"토","해":"수",
};

function splitPillar(pillar) {
  if (!pillar || typeof pillar !== "string" || pillar.length < 2) throw new Error(`Invalid pillar: ${pillar}`);
  const stem = pillar[0];
  const branch = pillar[1];
  return { stem, branch };
}

function stemIndex(stem) {
  const i = STEMS.indexOf(stem);
  if (i < 0) throw new Error(`Unknown stem: ${stem}`);
  return i;
}

function branchIndex(branch) {
  const i = BRANCHES.indexOf(branch);
  if (i < 0) throw new Error(`Unknown branch: ${branch}`);
  return i;
}

function pillarToIndex(pillar) {
  const { stem, branch } = splitPillar(pillar);
  const si = stemIndex(stem);
  const bi = branchIndex(branch);
  for (let k = 0; k < 60; k++) {
    if ((k % 10) === si && (k % 12) === bi) return k;
  }
  throw new Error(`Cannot map pillar to 60-index: ${pillar}`);
}

function indexToPillar(idx) {
  const k = ((idx % 60) + 60) % 60;
  return `${STEMS[k % 10]}${BRANCHES[k % 12]}`;
}

function stepPillar(pillar, step) {
  const k = pillarToIndex(pillar);
  return indexToPillar(k + step);
}

module.exports = {
  STEMS, BRANCHES,
  STEM_YINYANG, STEM_ELEMENT, BRANCH_ELEMENT,
  splitPillar, stemIndex, branchIndex,
  pillarToIndex, indexToPillar, stepPillar,
};
